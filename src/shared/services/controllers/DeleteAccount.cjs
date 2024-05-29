const express = require("express")
const router = express.Router();
const UserModel = require('../../../Client/services/models/User.cjs');
const BarbershopModel = require('../../../Barbershop/services/models/Barber.cjs');

const delUser = async (req, res, Model) => {
    const { id } = req.headers;
    try {
        const client = await Model.findByIdAndDelete(id);
        if (!client) {
            return res.status(404).json({
                error: true,
                message: "Client not found"
            });
        }
        return res.status(200).json({
            error: false,
            message: "Client deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

router.delete("/delClient", async (req, res) => {
    await delUser(req, res, UserModel)
});

router.delete("/delBarbershop", async (req, res) => {
    await delUser(req, res, BarbershopModel)
});



module.exports = router;