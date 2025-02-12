const express = require('express');
const router = express.Router();
const { upload } = require('../config/MulterConfig');
const AddIconFooterModel = require('../models/AddIconFooterModel');

router.post('/add-icon-footer', upload.single("icon"), async (req, res) => {
    try {
        const [title, color, url] = req.body;
        const imageFile = req.body.file;

        if (!imageFile) {
            return res.status(400).json({ error: 'not found req body file' });
        }

        const newModel = AddIconFooterModel({
            title: title,
            color: color,
            url: url,
            icon: imageFile,
        });

        const save = await newModel.save();
        
        return res.status(200).json(save);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message })
    }
});

module.exports = router;