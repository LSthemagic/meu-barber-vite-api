const express = require("express");
const BarbershopModel = require("../models/Barber.cjs");
const router = express.Router();

const handleDelete = async (req, res, model, itemType) => {
    const { id, item_id } = req.headers;

    try {
        const document = await model.findById(id);
        if (!document) {
            return res.status(400).json({
                error: true,
                message: `${itemType} not found.`
            });
        }

        const itemIndex = document[itemType].findIndex((item) => item._id == item_id);
        if (itemIndex === -1) {
            return res.status(400).json({
                error: true,
                message: `${itemType.slice(0, -1)} not found.`
            });
        }

        // Remove the item from the array
        document[itemType].splice(itemIndex, 1);

        // Save the updated document
        await document.save();

        return res.status(200).json({
            error: false,
            message: "Deleted data successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error."
        });
    }
};

router.delete("/deleteBarber", (req, res) => handleDelete(req, res, BarbershopModel, 'barbers'));

router.delete("/deleteService", (req, res) => handleDelete(req, res, BarbershopModel, 'services'));


module.exports = router