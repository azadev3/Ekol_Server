const express = require('express');
const router = express.Router();
const { uploadConfig } = require('../config/MulterC');
const MetaFaviconModel = require('../models/MetaFaviconModel');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mountPath = require('../config/mountPath');

router.post('/upload-favicon', uploadConfig.single('imgback'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file.' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const imgFileName = `${uuidv4()}-${Date.now()}${fileExtension}`;
    const imgOutputPath = path.join(mountPath, imgFileName);
    const imageFile = `/public/${imgOutputPath}`;

    const existingFavicon = await MetaFaviconModel.findOne();

    if (existingFavicon) {
      existingFavicon.favicon = imageFile;
      const updatedFavicon = await existingFavicon.save();
      return res.status(200).json(updatedFavicon);
    } else {
      const createData = new MetaFaviconModel({
        favicon: imageFile,
      });
      const savedData = await createData.save();
      return res.status(200).json(savedData);
    }
  } catch (error) {
    console.error('Upload Favicon Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/upload-favicon', async (req, res) => {
  const data = MetaFaviconModel.find();
  if (!data) {
    return res.status(404).json({ message: 'not found favicon' });
  }

  return res.status(200).json(data);
});

module.exports = router;
