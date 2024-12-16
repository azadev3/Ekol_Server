const express = require('express');
const router = express.Router();
const EnterpriseModel = require('../models/EnterpriseModel');

router.post('/add-enterprise', async (req, res) => {
 try {
  const { data } = req.body;
  if (!data) {
   return res.status(404).json({ message: 'Data not found' });
  }

  const enterprises = JSON.parse(data);
  const names = enterprises.map((entry) => ({
   value: entry.name,
  }));

  let existingData = await EnterpriseModel.findOne();

  if (existingData) {
   existingData.name = [...existingData.name, ...names];
   await existingData.save();
  } else {
   existingData = new EnterpriseModel({
    name: names,
   });
   await existingData.save();
  }

  return res.status(200).json({ message: 'Enterprise data updated successfully!' });
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });
 }
});

router.get('/add-enterprise', async (req, res) => {
 try {
  const data = await EnterpriseModel.find();

  if (!data) {
   return res.status(404).json({ message: 'error data not found' });
  }

  res.status(200).json(data);
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: error });
 }
});

router.delete('/add-enterprise/:id', async (req, res) => {
 try {
  const { id } = req.params;

  const enterprise = await EnterpriseModel.findOne();
  if (!enterprise) {
   return res.status(404).json({ message: 'Data not found.' });
  }

  enterprise.name = enterprise.name.filter((item) => item._id.toString() !== id);

  await enterprise.save();

  return res.status(200).json({ message: 'Data deleted successfully.' });
 } catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Deletion error', error });
 }
});

module.exports = router;
