const express = require("express")
const BarberModel = require("../../../Barbershop/services/models/Barber.cjs");
const router = express.Router()

const getImages = async (Model, res, req) => {
    try {
        const { ID } = req.body;
        const barbershop = await Model.findById(ID)
        if (!barbershop) {
            return res.status(404).json({
                error: true,
                message: "Barbearia não encontrada!"
            })
        }
        const picture = await barbershop.picture
        return res.json(picture)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
}

router.get("/pictureBarbershop", async (req, res) => {
    await getImages(BarberModel, res, req)
})

module.exports = router