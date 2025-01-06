const express = require('express');
const router = express.Router();
const MetaTagsHomeModel = require('../models/MetaTagsHome');
const upload = require('../config/MulterConfig');

router.post('/meta-tags-home', upload.none(), async (req, res) => {
  try {
    const updateData = {
      meta_title: {
        az: req.body.meta_title_az || '',
        en: req.body.meta_title_en || '',
        ru: req.body.meta_title_ru || '',
      },
      meta_description: {
        az: req.body.meta_description_az || '',
        en: req.body.meta_description_en || '',
        ru: req.body.meta_description_ru || '',
      },
      meta_author: {
        az: req.body.meta_author_az || '',
        en: req.body.meta_author_en || '',
        ru: req.body.meta_author_ru || '',
      },
      meta_generator: {
        az: req.body.meta_generator_az || '',
        en: req.body.meta_generator_en || '',
        ru: req.body.meta_generator_ru || '',
      },
    };

    const savedData = await MetaTagsHomeModel.findOneAndUpdate({}, updateData, { new: true, upsert: true });

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/meta-tags-home', async (req, res) => {
  try {
    const datas = await MetaTagsHomeModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/meta-tags-home/:editid', upload.none(), async (req, res) => {
  try {
    const { editid } = req.params;
    const {
      meta_title_az,
      meta_title_en,
      meta_title_ru,
      meta_description_az,
      meta_description_en,
      meta_description_ru,
      meta_author_az,
      meta_author_en,
      meta_author_ru,
      meta_generator_az,
      meta_generator_en,
      meta_generator_ru,
    } = req.body;

    const existingHero = await MetaTagsHomeModel.findById(editid).exec();

    if (!existingHero) {
      return res.status(404).json({ error: 'MetaTagsHomeModel not found' });
    }

    const updatedHeroData = {};

    if (meta_title_az) updatedHeroData['meta_title.az'] = meta_title_az;
    if (meta_title_en) updatedHeroData['meta_title.en'] = meta_title_en;
    if (meta_title_ru) updatedHeroData['meta_title.ru'] = meta_title_ru;

    if (meta_description_az) updatedHeroData['meta_description.az'] = meta_description_az;
    if (meta_description_en) updatedHeroData['meta_description.en'] = meta_description_en;
    if (meta_description_ru) updatedHeroData['meta_description.ru'] = meta_description_ru;

    if (meta_author_az) updatedHeroData['meta_author.az'] = meta_author_az;
    if (meta_author_en) updatedHeroData['meta_author.en'] = meta_author_en;
    if (meta_author_ru) updatedHeroData['meta_author.ru'] = meta_author_ru;

    if (meta_generator_az) updatedHeroData['meta_generator.az'] = meta_generator_az;
    if (meta_generator_en) updatedHeroData['meta_generator.en'] = meta_generator_en;
    if (meta_generator_ru) updatedHeroData['meta_generator.ru'] = meta_generator_ru;

    const updatedMetaTags = await MetaTagsHomeModel.findByIdAndUpdate(editid, { $set: updatedHeroData }, { new: true }).lean().exec();

    if (!updatedMetaTags) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(updatedMetaTags);
  } catch (error) {
    console.error('Error updating hero data:', error);
    return res.status(500).json({ error: error.message });
  }
});

// for front
router.get('/meta-tags-home-front', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await MetaTagsHomeModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      meta_title: data.meta_title[preferredLanguage],
      meta_description: data.meta_description[preferredLanguage],
      meta_author: data.meta_author[preferredLanguage],
      meta_generator: data.meta_generator[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
