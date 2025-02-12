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

router.put('/update-icon-footer/:id', upload.single('icon'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, color, url } = req.body;
    const imageFile = req.file;

    const existingIcon = await AddIconFooterModel.findById(id);
    if (!existingIcon) {
      return res.status(404).json({ error: 'Icon not found' });
    }

    existingIcon.title = title || existingIcon.title;
    existingIcon.color = color || existingIcon.color;
    existingIcon.url = url || existingIcon.url;

    if (imageFile) {
      existingIcon.icon = imageFile.filename;
    }

    const updatedIcon = await existingIcon.save();

    return res.status(200).json(updatedIcon);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/delete-icon-footer/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const find = await AddIconFooterModel.findByIdAndDelete(id, { new: true });

    if (!find) {
      return res.status(400).json({ error: 'melumat tapilmadi' });
    }

    return res.status(200).json({ success: 'muveffeqiyyetle silindi' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
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
});

module.exports = router;
