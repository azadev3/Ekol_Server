const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const PurchaseRules = require('../models/PurchaseRulesModel');

router.post(
  '/purchaserules',
  upload.fields([
    { name: 'pdfaz', maxCount: 1 },
    { name: 'pdfen', maxCount: 1 },
    { name: 'pdfru', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const requiredFields = ['title_az', 'title_en', 'title_ru'];
      const pdfAzPath = req.files['pdfaz'] ? `/public/${req.files['pdfaz'][0].filename}` : '';
      const pdfEnPath = req.files['pdfen'] ? `/public/${req.files['pdfen'][0].filename}` : '';
      const pdfRuPath = req.files['pdfru'] ? `/public/${req.files['pdfru'][0].filename}` : '';

      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ error: `Missing field: ${field}` });
        }
      }

      const pdfFile = req.file ? `/public/${req.file.filename}` : '';

      const createData = new PurchaseRules({
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

router.get('/purchaserules', async (req, res) => {
  try {
    const datas = await PurchaseRules.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/purchaserules/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await PurchaseRules.findById(editid).lean().exec();

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
  '/purchaserules/:editid',
  upload.fields([
    { name: 'pdfaz', maxCount: 1 },
    { name: 'pdfen', maxCount: 1 },
    { name: 'pdfru', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { editid } = req.params;
      const { title_az, title_en, title_ru } = req.body;

      // Find the existing announcement by ID
      const existingRules = await PurchaseRules.findById(editid).exec();
      if (!existingRules) {
        return res.status(404).json({ error: 'PurchaseRules not found' });
      }

      const updatedData = {};

      // Update title if provided
      if (title_az || title_en || title_ru) {
        updatedData.title = {
          az: title_az || existingRules.title.az,
          en: title_en || existingRules.title.en,
          ru: title_ru || existingRules.title.ru,
        };
      }

      // Handle PDF updates
      if (req.files) {
        // Check and update each language's PDF if a new file is uploaded
        if (req.files['pdfaz']) {
          updatedData.pdf = updatedData.pdf || {};
          updatedData.pdf.az = `/public/${req.files['pdfaz'][0].filename}`;
        }
        if (req.files['pdfen']) {
          updatedData.pdf = updatedData.pdf || {};
          updatedData.pdf.en = `/public/${req.files['pdfen'][0].filename}`;
        }
        if (req.files['pdfru']) {
          updatedData.pdf = updatedData.pdf || {};
          updatedData.pdf.ru = `/public/${req.files['pdfru'][0].filename}`;
        }
      } else {
        // Keep the existing PDF paths if no new files are uploaded
        updatedData.pdf = existingRules.pdf;
      }

      // If there are no changes to update, return the existing data
      if (Object.keys(updatedData).length === 0) {
        return res.status(200).json(existingRules);
      }

      // Update the announcement in the database
      const updatedPurchaseRules = await PurchaseRules.findByIdAndUpdate(editid, { $set: updatedData }, { new: true })
        .lean()
        .exec();

      return res.status(200).json(updatedPurchaseRules);
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.delete('/purchaserules/:deleteid', async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await PurchaseRules.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

// for front
router.get('/purchaserulesfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await PurchaseRules.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      pdf: data.pdf[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
