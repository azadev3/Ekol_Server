const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const StructureModel = require('../models/StructureModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post('/structure', checkUser, checkPermissions('create_struktur'), upload.single('imgback'), async (req, res) => {
 try {
  const imageFile = req.file ? `/public/${req.file.filename}` : '';

  const createData = new StructureModel({
   image: imageFile,
  });

  const savedData = await createData.save();

  return res.status(200).json(savedData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.get('/structure', checkUser, checkPermissions('list_struktur'), async (req, res) => {
 try {
  const datas = await StructureModel.find();
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }
  return res.status(200).json(datas);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.get('/structure/:editid', async (req, res) => {
 try {
  const { editid } = req.params;

  const datasForId = await StructureModel.findById(editid).lean().exec();

  if (!datasForId) {
   return res.status(404).json({ error: 'not found editid' });
  }

  return res.status(200).json(datasForId);
 } catch (error) {
  console.error('Error fetching data:', error);
  return res.status(500).json({ error: error.message });
 }
});

router.put('/structure/:editid', checkUser, checkPermissions('update_struktur'), upload.single('imgback'), async (req, res) => {
 try {
  const { editid } = req.params;

  // Img
  const existingStructure = await StructureModel.findById(editid).lean();
  if (!existingStructure) {
   return res.status(404).json({ error: 'Document not found with given ID' });
  }

  const imageFile = req.file ? `/public/${req.file.filename}` : existingStructure.image;

  const updatedStr = await StructureModel.findByIdAndUpdate(
   editid,
   {
    $set: {
     image: imageFile,
    },
   },
   { new: true }
  )
   .lean()
   .exec();

  if (!updatedStr) {
   return res.status(404).json({ error: 'not found editid' });
  }

  return res.status(200).json(updatedStr);
 } catch (error) {
  console.error('Error updating data:', error);
  return res.status(500).json({ error: error.message });
 }
});

router.delete('/structure/:deleteid', checkUser, checkPermissions('delete_struktur'), async (req, res) => {
 try {
  const { deleteid } = req.params;
  const deleteData = await StructureModel.findByIdAndDelete(deleteid);

  if (!deleteData) {
   return res.status(404).json({ message: 'dont delete data or not found data or another error' });
  }

  return res.status(200).json({ message: 'successfully deleted data' });
 } catch (error) {}
});

// for front
router.get('/structure_img_front', async (req, res) => {
 try {
  const datas = await StructureModel.find();
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }

  const filteredData = datas.map((data) => ({
   image: data.image,
  }));

  return res.status(200).json(filteredData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});
module.exports = router;
