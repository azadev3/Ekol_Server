const express = require('express');
const router = express.Router();
const ShowHiddenContactModel = require('../models/ShowHiddenContact');

router.post('/hidden-contact', async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenContactModel.findOneAndUpdate({}, { showed: show }, { upsert: true, new: true });

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get('/hidden-contact-front', async (req, res) => {
  try {
    const showState = await ShowHiddenContactModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
