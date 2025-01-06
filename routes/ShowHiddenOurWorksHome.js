const express = require('express');
const router = express.Router();
const ShowHiddenOurWorksHomeModel = require('../models/ShowHiddenOurWorksHomeModel');

router.post('/hidden-ourworkshome', async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenOurWorksHomeModel.findOneAndUpdate({}, { showed: show }, { upsert: true, new: true });

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get('/hidden-ourworkshome-front', async (req, res) => {
  try {
    const showState = await ShowHiddenOurWorksHomeModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
