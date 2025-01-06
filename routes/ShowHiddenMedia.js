const express = require('express');
const router = express.Router();
const ShowHiddenMediaModel = require('../models/ShowHiddenMediaModel');

router.post('/hidden-media', async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenMediaModel.findOneAndUpdate({}, { showed: show }, { upsert: true, new: true });

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get('/hidden-media-front', async (req, res) => {
  try {
    const showState = await ShowHiddenMediaModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
