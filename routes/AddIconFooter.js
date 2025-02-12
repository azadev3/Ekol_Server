const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const AddIconFooterModel = require('../models/AddIconFooterModel');

router.post('/add-icon-footer', upload.single('icon'), async (req, res) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'not found req body file' });
    }

    const newModel = AddIconFooterModel({
      title: req.body.title,
      color: req.body.color,
      url: req.body.url,
      icon: imageFile.filename,
    });

    const save = await newModel.save();

    return res.status(200).json(save);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/get-icon-footer', async (req, res) => {
    try {
        const findIcons = await AddIconFooterModel.find();

        return res.status(200).json(findIcons);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
})

module.exports = router;
