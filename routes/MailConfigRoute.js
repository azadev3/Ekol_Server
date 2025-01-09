const express = require('express');
const router = express.Router();
const MailConfigModel = require('../models/MailConfigModel');
const upload = require('../config/MulterConfig');

router.post('/mail-config', upload.none(), async (req, res) => {
  try {
    const { host, port, user, pass } = req.body;

    if (!host || !user || !pass) {
      return res.status(400).json({ message: 'Required fields are missing!' });
    }

    const updateData = {
      host: host,
      port: port || 465,
      user: user,
      pass: pass,
    };

    const savedData = await MailConfigModel.findOneAndUpdate({}, updateData, { new: true, upsert: true });

    return res.status(200).json({ message: 'Mail configuration saved successfully!', data: savedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/mail-config', async (req, res) => {
  try {
    const datas = await MailConfigModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
