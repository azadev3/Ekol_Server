const express = require('express');
const router = express.Router();
const StageModel = require('../models/StageModel');

router.post('/add-stage', async (req, res) => {
 try {
  const { data } = req.body;
  if (!data) {
   return res.status(404).json({ message: 'Data not found' });
  }

  const stages = JSON.parse(data);
  const names = stages.map((entry) => ({
   value: entry.name,
  }));

  let existingData = await StageModel.findOne();

  if (existingData) {
   existingData.name = [...existingData.name, ...names];
   await existingData.save();
  } else {
   existingData = new StageModel({
    name: names,
   });
   await existingData.save();
  }

  return res.status(200).json({ message: 'Stage data updated successfully!' });
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });
 }
});

router.get('/add-stage', async (req, res) => {
 try {
  const data = await StageModel.find();

  if (!data) {
   return res.status(404).json({ message: 'error data not found' });
  }

  res.status(200).json(data);
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error });
 }
});

router.delete('/add-stage/:id', async (req, res) => {
 try {
  const { id } = req.params;

  const stages = await StageModel.findOne();
  if (!stages) {
   return res.status(404).json({ message: 'Data not found.' });
  }

  stages.name = stages.name.filter((item) => item._id.toString() !== id);

  await stages.save();

  return res.status(200).json({ message: 'Data deleted successfully.' });
 } catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Deletion error', error });
 }
});

module.exports = router;
