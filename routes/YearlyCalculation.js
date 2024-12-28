const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const YearlyCalculations = require('../models/YearlyCalculationsModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post(
  '/yearly_calculations',
  checkUser,
  checkPermissions('create_illik_hesabatlar'),
  upload.fields([
    { name: 'pdfaz', maxCount: 1 },
    { name: 'pdfen', maxCount: 1 },
    { name: 'pdfru', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const requiredFields = ['title_az', 'title_en', 'title_ru'];

      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ error: `Missing field: ${field}` });
        }
      }

      const pdfAzPath = req.files['pdfaz'] ? `/public/${req.files['pdfaz'][0].filename}` : '';
      const pdfEnPath = req.files['pdfen'] ? `/public/${req.files['pdfen'][0].filename}` : '';
      const pdfRuPath = req.files['pdfru'] ? `/public/${req.files['pdfru'][0].filename}` : '';

      const createData = new YearlyCalculations({
        title: {
          az: req.body.title_az,
          en: req.body.title_en,
          ru: req.body.title_ru,
        },
        pdf: {
          az: pdfAzPath,
          en: pdfEnPath,
          ru: pdfRuPath,
        },
      });

      const savedData = await createData.save();

      return res.status(200).json(savedData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

router.get('/yearly_calculations', checkUser, checkPermissions('list_illik_hesabatlar'), async (req, res) => {
  try {
    const datas = await YearlyCalculations.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/yearly_calculations/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await YearlyCalculations.findById(editid).lean().exec();

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
  '/yearly_calculations/:editid',
  checkUser,
  checkPermissions('update_illik_hesabatlar'),
  upload.fields([
    { name: 'pdfaz', maxCount: 1 },
    { name: 'pdfen', maxCount: 1 },
    { name: 'pdfru', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { editid } = req.params;
      const { title_az, title_en, title_ru } = req.body;

      const pdfAzPath = req.files['pdfaz'] ? `/public/${req.files['pdfaz'][0].filename}` : '';
      const pdfEnPath = req.files['pdfen'] ? `/public/${req.files['pdfen'][0].filename}` : '';
      const pdfRuPath = req.files['pdfru'] ? `/public/${req.files['pdfru'][0].filename}` : '';

      const updatedYearlyCalculations = await YearlyCalculations.findByIdAndUpdate(
        editid,
        {
          $set: {
            title: {
              az: title_az,
              en: title_en,
              ru: title_ru,
            },
            pdf: {
              az: pdfAzPath,
              en: pdfEnPath,
              ru: pdfRuPath,
            },
          },
        },
        { new: true },
      )
        .lean()
        .exec();

      if (!updatedYearlyCalculations) {
        return res.status(404).json({ error: 'not found editid' });
      }

      return res.status(200).json(updatedYearlyCalculations);
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.delete('/yearly_calculations/:deleteid', checkUser, checkPermissions('delete_illik_hesabatlar'), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await YearlyCalculations.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

// for front
router.get('/yearly_calculationsfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await YearlyCalculations.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      createdAt: data.createdAt,
      pdf: data.pdf[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
