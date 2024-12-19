const express = require('express');
const router = express.Router();
const ShowHiddenSocialModel = require('../models/ShowHiddenSocial');

router.post('/hidden-social', async (req, res) => {
 try {
  const { show } = req.body;

  const saved = await ShowHiddenSocialModel.findOneAndUpdate({}, { showed: show }, { upsert: true, new: true });

  return res.status(200).json({ saved });
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: error });
 }
});

router.get('/hidden-social-front', async (req, res) => {
 try {
  const showState = await ShowHiddenSocialModel.findOne();

  return res.status(200).json(showState);
 } catch (error) {
  console.log(error);
  res.status(500).json({ error: error });
 }
});

module.exports = router;
