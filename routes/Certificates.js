const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const Certificates = require('../models/CertificatesModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post('/certificates', checkUser, checkPermissions('create_sertifikatlar'), upload.none(), async (req, res) => {
  try {
    const requiredFields = ['title_az', 'title_en', 'title_ru', 'description_az', 'description_en', 'description_ru'];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const createData = new Certificates({
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
      statusActive: req.body.statusActive || true,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/certificates', checkUser, checkPermissions('list_sertifikatlar'), async (req, res) => {
  try {
    const datas = await Certificates.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/certificates/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Certificates.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/certificates/:editid', checkUser, checkPermissions('update_sertifikatlar'), upload.none(), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const updatedCertificates = await Certificates.findByIdAndUpdate(
      editid,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
        },
      },
      { new: true },
    )
      .lean()
      .exec();

    if (!updatedCertificates) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(updatedCertificates);
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/certificates/:deleteid', checkUser, checkPermissions('delete_sertifikatlar'), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Certificates.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

router.put('/certificates/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActive } = req.body;

    if (typeof statusActive !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean value' });
    }

    const updatedPurch = await Certificates.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

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
router.get('/certificatesfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await Certificates.find({ statusActive: true });
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
