const express = require("express")
const BarberModel = require("../../../Barbershop/services/models/Barber.cjs");
const router = express.Router()
const upload = require("../../../Barbershop/services/middlewares/Storage.cjs")
const fs = require("fs")
const getImages = async (Model, req, res) => {
    try {
        const { id } = req.headers;
        const barbershop = await Model.findById(id)
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

const putImage = async (Model, req, res) => {
    try {
        const { ID } = req.body;
        const file = req.file;
        const name = file.originalname.split('.')
        const barbershop = await Model.findById(ID)
        if (!barbershop) {
            return res.status(404).json({
                error: true,
                message: "Barbearia não encontrada!"
            })
        }
        if(fs.existsSync(`src\\uploads\\${barbershop.picture[0].src}`)){
            fs.unlinkSync(`src\\uploads\\${barbershop.picture[0].src}`)
            console.log(`src\\uploads\\${barbershop.picture[0].src}`)
        }
        
        barbershop.picture[0].name = name[0];
        barbershop.picture[0].src = file.filename;
        await barbershop.save();
        return res.json(barbershop.picture[0])
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
}

const deleteImage = async (Model, req, res) => {
    try {
        const { ID } = req.body;
        const barbershop = await Model.findById(ID)
        if (!barbershop) {
            return res.status(404).json({
                error: true,
                message: "Barbearia não encontrada!"
            })
        }

        fs.unlinkSync(`src\\uploads\\${barbershop.picture[0].src}`)
        barbershop.picture.splice(0, 1);
        await barbershop.save();
        return res.json({
            error: false,
            message: "Imagem deletada com sucesso!"
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
}

router.get("/pictureBarbershop", async (req, res) => {
    await getImages(BarberModel, req, res)
})

router.put("/putPictureBarbershop", upload.single("file"), async (req, res) => {
    await putImage(BarberModel, req, res)
})

router.delete("/deleteImage", async (req, res) => {
    await deleteImage(BarberModel, req, res)
})
module.exports = router