const express = require('express');
const router = express.Router();
const NewBlogs = require('../models/NewBlogsModel');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { uploadConfig, useSharp } = require('../config/MulterC');
const mountPath = require('../config/mountPath');
const checkUser = require('../middlewares/checkUser');
const checkPermission = require('../middlewares/checkPermissions');

router.post('/newblogs', checkUser, checkPermission('create_blog'), uploadConfig.single('imgback'), async (req, res) => {
  try {
    // Img
    let imageFile = '';

    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(req.file.buffer, imgOutputPath);

      imageFile = `/public/${imgFileName}`;
    }

    const createData = new NewBlogs({
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
      slogan: {
        az: req.body.slogan_az,
        en: req.body.slogan_en,
        ru: req.body.slogan_ru,
      },
      created_at: req.body.created_at,
      updated: req.body.updated,
      image: imageFile,
      status: req.body.status || true,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/newblogs', checkUser, checkPermission('list_blog'), async (req, res) => {
  try {
    const datas = await NewBlogs.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/newblogs/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await NewBlogs.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/newblogs/:editid", uploadConfig.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;
//     // Img
//     let imageFile = "";

//     if (req.file) {
//       const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
//       const imgOutputPath = path.join(mountPath, imgFileName);

//       await useSharp(req.file.buffer, imgOutputPath);

//       imageFile = `/public/${imgFileName}`;
//     }

//     const updatedNewBlog = await NewBlogs.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           title: {
//             az: title_az,
//             en: title_en,
//             ru: title_ru,
//           },
//           description: {
//             az: description_az,
//             en: description_en,
//             ru: description_ru,
//           },
//           created_at: req.body.created_at,
//           updated: req.body.updated,
//           image: imageFile,
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedNewBlog) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedNewBlog);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put('/newblogs/:editid', checkUser, checkPermission('update_blog'), uploadConfig.single('imgback'), async (req, res) => {
  try {
    const { editid } = req.params;
    const {
      title_az,
      title_en,
      title_ru,
      description_az,
      description_en,
      description_ru,
      slogan_az,
      slogan_en,
      slogan_ru,
      created_at,
      updated,
    } = req.body;

    const existingBlog = await NewBlogs.findById(editid).lean();
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    let imageFile = existingBlog.image;

    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(req.file.buffer, imgOutputPath);

      imageFile = `/public/${imgFileName}`;
    }

    const updatedData = {
      title: {
        az: title_az || existingBlog.title.az,
        en: title_en || existingBlog.title.en,
        ru: title_ru || existingBlog.title.ru,
      },
      description: {
        az: description_az || existingBlog.description.az,
        en: description_en || existingBlog.description.en,
        ru: description_ru || existingBlog.description.ru,
      },
      slogan: {
        az: slogan_az || existingBlog.slogan.az,
        en: slogan_en || existingBlog.slogan.en,
        ru: slogan_ru || existingBlog.slogan.ru,
      },
      created_at: created_at || existingBlog.created_at,
      updated: updated || existingBlog.updated,
      image: imageFile,
    };

    const updatedNewBlog = await NewBlogs.findByIdAndUpdate(editid, { $set: updatedData }, { new: true }).lean().exec();

    return res.status(200).json(updatedNewBlog);
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/newblog/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean value' });
    }

    const updatedBlog = await NewBlogs.findByIdAndUpdate(id, { status: status }, { new: true }).lean().exec();

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/newblogs/:deleteid', checkUser, checkPermission('delete_blog'), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await NewBlogs.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

// for front
router.get('/newblogfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await NewBlogs.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      slogan: data.slogan[preferredLanguage],
      image: data.image,
      created_at: data.created_at,
      updated: data.updated,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/lastnewblog', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const lastnewblog = await NewBlogs.find({ status: true }).sort({ created_at: -1 }).limit(5).lean();
    if (!lastnewblog || lastnewblog.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    const filteredData = lastnewblog.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      created_at: data.created_at,
      updated: data.updated,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ error: error.message, message: 'Failed to fetch last blogs' });
  }
});

module.exports = router;
