const express = require('express');
const router = express.Router();
const ShowHiddenHeroModel = require('../models/ShowHiddenHeroModel');

router.post('/hidden-hero', async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenHeroModel.findOneAndUpdate({}, { showed: show }, { upsert: true, new: true });

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get('/hidden-hero-front', async (req, res) => {
  try {
    const showState = await ShowHiddenHeroModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
