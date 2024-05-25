const express = require("express");
const BarberModel = require("../models/Barber.cjs");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const upload = require("../middlewares/Storage.cjs");
const router = express.Router();
const fs = require("fs")
// const nodemailer = require('nodemailer')

const generateToken = (user = {}) => {
	return jwt.sign(
		{
			id: user.id,
			name: user.name
		},
		process.env.REACT_APP_SECRET,
		{
			expiresIn: 86400
		}
	);
};

router.post("/uploadImage", upload.single("file"), async (req, res) => {
	try {
		const { name, id } = req.body;
		const file = req.file;

		if (!file) {
			return res.status(400).json({
				error: true,
				message: "Nenhuma imagem fornecida"
			});
		}

		const barbershop = await BarberModel.findById(id);
		if (!barbershop) {

			return res.status(400).json({
				error: true,
				message: "Barbearia não encontrada. Por favor, tente novamente mais tarde."
			});
		}
		// Ensure barbershop.picture is defined and is an array
		if (!Array.isArray(barbershop.picture)) {
			barbershop.picture = [];
		} else {
			barbershop.picture.splice(0, 1);
		}


		// Save the file path and name in the barbershop document
		barbershop.picture.push({ name, src: file.filename });
		await barbershop.save();

		return res.json({
			error: false,
			message: "Imagem salva com sucesso."
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: true,
			message: "Erro no servidor"
		});
	}
});


router.post("/registerBarber", async (req, res) => {
	try {
		const barber = await BarberModel.create({
			...req.body,
			clients: [],
			barbers: [],
		});
		barber.password = undefined;
		barber.barbers = undefined;
		barber.createdAt = undefined;
		barber.location = undefined;
		return res.json({
			error: false,
			data: barber,
			message: "Cadastro bem-sucedido!",
			token: generateToken(barber)
		});

	} catch (err) {
		console.log("err register barber", err);
		return res.status(400).json({
			error: true,
			message: "Erro ao registrar o cadastro."
		});
	}
});

router.post("/authenticateBarber", async (req, res) => {
	const { email, password } = req.body;
	try {
		const barbershop = await BarberModel.findOne({ email }).select("+password");

		if (!barbershop) {
			return res.status(401).json({
				error: true,
				message: "Esse cadastro não existe."
			})
		}

		if (!(await bcrypt.compare(password, barbershop.password))) {
			return res.status(400).json({
				error: true,
				message: "Senha incorreta!"
			})
		}

		barbershop.password = undefined;
		barbershop.barbers = undefined;
		barbershop.createdAt = undefined;
		barbershop.location = undefined;
		return res.json({
			error: false,
			message: "Bem Vindo!",
			barbershop,
			token: generateToken(barbershop)
		});
	} catch (e) {
		console.log(e.message)
		return res.status(400).json({
			error: true,
			message: "Dados de acesso inválidos!"
		})
	}
})

router.post("/addBarber", async (req, res) => {
	try {
		const { name, email, id } = req.body;

		const barbershop = await BarberModel.findById(id);

		if (!barbershop) {
			return res.status(400).json({
				error: true,
				message: "Barbearia não encontrada. Por favor, tente novamente mais tarde."
			});
		}

		// Check if the barber with the provided email already exists
		const existingBarber = barbershop.barbers.find(barber => barber.email === email);
		if (existingBarber) {
			return res.status(400).json({
				error: true,
				message: `O colaborador ${existingBarber.name} já faz parte da Barbearia.`
			});
		}

		// Push new barber data to the barbershop
		barbershop.barbers.push({ name, email }); // Push name and email directly

		await barbershop.save();

		return res.json({
			error: false,
			message: `O barbeiro ${name} foi registrado com sucesso na companhia.`
		});

	} catch (e) {
		console.log(`Error from add Barber: ${e}`);
		return res.status(400).json({
			error: true,
			message: "Erro interno ao adicionar um novo barbeiro. Tente novamente mais tarde!"
		});
	}
});

router.post("/saveService", async (req, res) => {
	try {
		const { id, nameService, price, duration } = req.body;
		const barbershop = await BarberModel.findById(id)

		if (!barbershop) {
			return res.status(400).json({
				error: true,
				message: "A barbearia informada não existe"
			})
		}

		const serviceAlreadyExists = barbershop.services.find((service) => service.nameService == nameService);

		if (serviceAlreadyExists) {
			return res.status(400).json({
				error: true,
				message: "Este serviço já está cadastrado nessa barbearia."
			})
		}

		barbershop.services.push({ nameService, price, duration })
		await barbershop.save()
		return res.json({
			error: false,
			data: barbershop.services,
			message: "Serviço adicionado."
		})
	} catch (e) {
		console.log(`Error from saveService API: ${e}`)
		return res.status(500).json({
			error: true,
			message: "Erro no servidor ao salvar serviço. Tente novamente mais tarde!"
		})
	}
})

module.exports = router;

