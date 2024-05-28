const express = require("express");
const BarbershopModel = require("../models/Barber.cjs");
const router = express.Router();

router.put("/updateServices", async (req, res) => {
    try {
        const { service_id, id, nameService, price, duration } = req.body;
        const barbershop = await BarbershopModel.findById(id)

        if (!barbershop) {
            return res.status(404).json({
                error: true,
                message: "Barbershop not found!"
            })
        }

        const service = barbershop.services.filter((item) => item._id == service_id)

        console.log(service)
        if (!service) {
            return res.status(404).json({
                error: true,
                message: "Service not found!"
            })
        }

        // atualizar serviço
        service[0].nameService = nameService
        service[0].price = price
        service[0].duration = duration
        // salvar dados e retornar mensagem
        await barbershop.save()
        return res.status(200).json({
            error: false,
            message: "Service updated successfully!"
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

router.put("/updateBarbers", async (req, res) => {
    try {
        const { id, barber_id, name, email } = req.body;
        const barbershop = await BarbershopModel.findById(id)

        if (!barbershop) {
            return res.status(404).json({
                error: true,
                message: "Barbershop not found!"
            })
        }

        const barber = barbershop.barbers.filter((item) => (
            item._id == barber_id
        ))

        if (!barber) {
            return res.status(404).json({
                error: true,
                message: "Barber not found!"
            })
        }

        // atualizar dados
        barber[0].name = name
        barber[0].email = email

        // salvar dados e retornar mensagem
        await barbershop.save()
        return res.status(200).json({
            error: false,
            message: "Barber updated successfully!"
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})


module.exports = router;