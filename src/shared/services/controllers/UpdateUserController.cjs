const express = require("express");
const router = express.Router();
const UserModel = require('../../../Client/services/models/User.cjs');
const BarbershopModel = require('../../../Barbershop/services/models/Barber.cjs');
const updatePassword = require("../middlewares/PasswordMiddleware.cjs");


// ##### Generics functions update ######
const putProfile = async (req, res, Model) => {
	const { email, name, id } = req.body;

	// Logging the request body to verify the received data
	console.log("Request body:", req.body);

	// Validate request body
	if (!id || !name || !email) {
		return res.status(400).json({
			error: true,
			message: "Invalid request data. 'id', 'name', and 'email' are required."
		});
	}

	try {
		const user = await Model.findById(id);
		if (!user) {
			return res.status(401).json({
				error: true,
				message: "Usuário não encontrado."
			});
		}

		// agr atualizar no banco de outra forma
		await Model.findByIdAndUpdate(id, { name, email }, { new: true });
		await user.save();


		res.status(200).json({
			error: false,
			message: "Dados atualizado com sucesso!"
		});

	} catch (e) {
		console.log(e);
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
	}
}

const putPassword = async (req, res, Model) => {
	try {
		const { password, id } = req.body;
		const user = await Model.findById(id);
		if (!user) {
			return res.status(401).json({
				error: true,
				message: "Usuário não encontrado."
			});
		}
		user.password = password;
		await user.save();
		res.status(200).json({
			error: false,
			message: "Senha atualizada com sucesso!"
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
	}
}

// ##### update CLIENT ######
router.put("/updatePasswordClient", updatePassword(UserModel), async (req, res) => {
	await putPassword(req, res, UserModel)
});

router.put("/updateProfileClient", async (req, res) => {
	await putProfile(req, res, UserModel)
});


// ##### update barbershop ######
router.put("/updatePasswordBarbershop", updatePassword(BarbershopModel), async (req, res) => {
	await putPassword(req, res, BarbershopModel)
});

router.put("/updateProfileBarbershop", async (req, res) => {
	await putProfile(req, res, BarbershopModel)
});



module.exports = router;