const express = require('express');
const router = express.Router();
const ShowHiddenAbout = require('../models/ShowHiddenAbout');

router.post('/hidden-about', async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenAbout.findOneAndUpdate({}, { showed: show }, { upsert: true, new: true });

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get('/hidden-about-front', async (req, res) => {
  try {
    const showState = await ShowHiddenAbout.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
