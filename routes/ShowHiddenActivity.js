const express = require('express');
const router = express.Router();
const ShowHiddenActivityModel = require('../models/ShowHiddenActivityModel');

router.post('/hidden-activity', async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenActivityModel.findOneAndUpdate({}, { showed: show }, { upsert: true, new: true });

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get('/hidden-activity-front', async (req, res) => {
  try {
    const showState = await ShowHiddenActivityModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
