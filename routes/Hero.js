const express = require('express');
const router = express.Router();
const { uploadConfig, useSharp } = require('../config/MulterC');
const Hero = require('../models/HeroModel');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mountPath = require('../config/mountPath');
const checkPermission = require('../middlewares/checkPermissions');
const checkUser = require('../middlewares/checkUser');

router.post('/hero', checkUser, checkPermission('create_hero'), uploadConfig.single('imgback'), async (req, res) => {
 try {
  // Img
  const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
  const imgOutputPath = path.join(mountPath, imgFileName);
  await useSharp(req.file ? req.file.buffer : '', imgOutputPath);
  const imageFile = `/public/${imgFileName}`;

  const createData = new Hero({
   title: {
    az: req.body.title_az,
    en: req.body.title_en,
    ru: req.body.title_ru,
   },
   description: {
    az: req.body.description_az,
    en: req.body.description_en,
    ru: req.body.description_ru,
   },
   image: imageFile,
   statusActive: req.body.statusActive || true,
  });

  const savedData = await createData.save();

  return res.status(200).json(savedData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.get('/hero', checkUser, checkPermission('list_hero'), async (req, res) => {
 try {
  const datas = await Hero.find();
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }
  return res.status(200).json(datas);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.get('/hero/:editid', async (req, res) => {
 try {
  const { editid } = req.params;

  const datasForId = await Hero.findById(editid).lean().exec();

  if (!datasForId) {
   return res.status(404).json({ error: 'not found editid' });
  }

  return res.status(200).json(datasForId);
 } catch (error) {
  console.error('Error fetching data:', error);
  return res.status(500).json({ error: error.message });
 }
});

router.put(
    '/hero/:editid',
    checkUser,
    checkPermission('update_hero'),
    uploadConfig.single('imgback'),
    async (req, res) => {
     try {
      const { editid } = req.params;
      const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;
   
      const existingHero = await Hero.findById(editid).exec();
   
      if (!existingHero) {
       return res.status(404).json({ error: 'Hero not found' });
      }
   
      const updatedHeroData = {};
   
      updatedHeroData['title.az'] = title_az || '';  
      updatedHeroData['title.en'] = title_en || '';
      updatedHeroData['title.ru'] = title_ru || '';
   
      updatedHeroData['description.az'] = description_az || '';
      updatedHeroData['description.en'] = description_en || '';
      updatedHeroData['description.ru'] = description_ru || '';
   
      if (req.file) {
       const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
       const imgOutputPath = path.join(mountPath, imgFileName);
       await useSharp(req.file.buffer, imgOutputPath);
       updatedHeroData.image = `/public/${imgFileName}`;
      }
   
      const updatedHero = await Hero.findByIdAndUpdate(editid, { $set: updatedHeroData }, { new: true }).lean().exec();
   
      if (!updatedHero) {
       return res.status(404).json({ error: 'not found editid' });
      }
   
      return res.status(200).json(updatedHero);
     } catch (error) {
      console.error('Error updating hero data:', error);
      return res.status(500).json({ error: error.message });
     }
    }
   );
   

router.delete('/hero/:deleteid', checkUser, checkPermission('delete_hero'), async (req, res) => {
 try {
  const { deleteid } = req.params;
  const deleteData = await Hero.findByIdAndDelete(deleteid);

  if (!deleteData) {
   return res.status(404).json({ message: 'dont delete data or not found data or another error' });
  }

  return res.status(200).json({ message: 'successfully deleted data' });
 } catch (error) {}
});

router.put('/hero/status/:id', async (req, res) => {
 try {
  const { id } = req.params;
  const { statusActive } = req.body;

  if (typeof statusActive !== 'boolean') {
   return res.status(400).json({ error: 'Status must be a boolean value' });
  }

  const updatedPurch = await Hero.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

  if (!updatedPurch) {
   return res.status(404).json({ error: ' not found' });
  }

  return res.status(200).json(updatedPurch);
 } catch (error) {
  console.error('Error updating status:', error);
  return res.status(500).json({ error: error.message });
 }
});

// for front
router.get('/herofront', async (req, res) => {
 try {
  const acceptLanguage = req.headers['accept-language'];
  const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

  const datas = await Hero.find({ statusActive: true });
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }

  const filteredData = datas.map((data) => ({
   title: data.title[preferredLanguage],
   description: data.description[preferredLanguage],
   image: data.image,
  }));

  return res.status(200).json(filteredData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

module.exports = router;
