const express = require('express');
const router = express.Router();
const CategoryModel = require('../models/DynamicCategoryModel');
const upload = require('../config/MulterConfig');

router.post('/dynamic-category', upload.none(), async (req, res) => {
  try {
    const savedData = new CategoryModel({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      statusActive: req.body.statusActive || true,
    });

    const saved = await savedData.save();

    return res.status(200).json(saved);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'server error' });
  }
});

router.get('/dynamic-category', async (req, res) => {
  try {
    const datas = await CategoryModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/dynamic-category/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await CategoryModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/dynamic-category/:editid', async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru } = req.body;

    const updated = await CategoryModel.findByIdAndUpdate(
      editid,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
        },
      },
      { new: true },
    )
      .lean()
      .exec();

    if (!updated) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/dynamic-category/:deleteid', async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await CategoryModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

// for front
router.get('/dynamic-category-front', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await CategoryModel.find({ statusActive: true });
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/dynamic-category/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActive } = req.body;

    if (typeof statusActive !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean value' });
    }

    const updatedPurch = await CategoryModel.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

    if (!updatedPurch) {
      return res.status(404).json({ error: ' not found' });
    }

    return res.status(200).json(updatedPurch);
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
