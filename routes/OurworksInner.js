const express = require('express');
const router = express.Router();
const OurWorksInner = require('../models/OurworksinnerModel');
const upload = require('../config/MulterConfig');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post('/ourworksinner', checkUser, checkPermissions('create_gorduyumuzisler_daxili'), upload.none(), async (req, res) => {
  try {
    const createData = new OurWorksInner({
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

router.get('/ourworksinner', checkUser, checkPermissions('list_gorduyumuzisler_daxili'), async (req, res) => {
  try {
    const datas = await OurWorksInner.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/ourworksinner/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await OurWorksInner.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put(
//  '/ourworksinner/:editid',
//  checkUser,
//  checkPermissions('update_gorduyumuzisler_daxili'),
//  upload.none(),
//  async (req, res) => {
//   try {
//    const { editid } = req.params;
//    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

//    const updatedOurWorksInner = await OurWorksInner.findByIdAndUpdate(
//     editid,
//     {
//      $set: {
//       title: {
//        az: title_az,
//        en: title_en,
//        ru: title_ru,
//       },
//       description: {
//        az: description_az,
//        en: description_en,
//        ru: description_ru,
//       },
//      },
//     },
//     { new: true }
//    )
//     .lean()
//     .exec();

//    if (!updatedOurWorksInner) {
//     return res.status(404).json({ error: 'not found editid' });
//    }

//    return res.status(200).json(updatedOurWorksInner);
//   } catch (error) {
//    console.error('Error updating data:', error);
//    return res.status(500).json({ error: error.message });
//   }
//  }
// );

router.put('/ourworksinner/:editid', checkUser, checkPermissions('update_gorduyumuzisler_daxili'), upload.none(), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const existingData = await OurWorksInner.findById(editid).lean().exec();

    if (!existingData) {
      return res.status(404).json({ error: 'not found editid' });
    }

    const updatedFields = {};

    updatedFields.title = {
      az: title_az || existingData.title.az,
      en: title_en || existingData.title.en,
      ru: title_ru || existingData.title.ru,
    };

    updatedFields.description = {
      az: description_az || existingData.description.az,
      en: description_en || existingData.description.en,
      ru: description_ru || existingData.description.ru,
    };

    const updatedOurWorksInner = await OurWorksInner.findByIdAndUpdate(editid, { $set: updatedFields }, { new: true }).lean().exec();

    return res.status(200).json(updatedOurWorksInner);
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/ourworksinner/:deleteid', checkUser, checkPermissions('delete_gorduyumuzisler_daxili'), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await OurWorksInner.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

router.put('/ourworksinner/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActive } = req.body;

    if (typeof statusActive !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean value' });
    }

    const updatedPurch = await OurWorksInner.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

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
router.get('/ourworksinnerfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await OurWorksInner.find({ statusActive: true });
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
