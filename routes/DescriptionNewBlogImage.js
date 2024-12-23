const NewBlogDescriptionImageModel = require('../models/NewBlogDescriptionImageModel');
const express = require('express');
const router = express.Router();
const { uploadConfig, useSharp } = require('../config/MulterC');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mountPath = require('../config/mountPath');
const checkUser = require('../middlewares/checkUser');
const checkPermission = require('../middlewares/checkPermissions');

// Multiple file handling
router.post('/newblogimage', uploadConfig.array('imgback'), async (req, res) => {
  try {
    const files = req.files;
    const selected_new_blog = req.body.selected_new_blog;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const imageFilePaths = [];
    for (let file of files) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(file.buffer, imgOutputPath);

      imageFilePaths.push(`/public/${imgFileName}`);
    }

    const createData = new NewBlogDescriptionImageModel({
      selected_new_blog,
      images: imageFilePaths,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/newblogimage', async (req, res) => {
  try {
    const datas = await NewBlogDescriptionImageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/newblogimage/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await NewBlogDescriptionImageModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/newblogimage/:editid", uploadConfig.array("newImages"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { selected_new_blog } = req.body;

//     const files = req.files;
//     if (!files || files.length === 0) {
//       return res.status(400).json({ error: "No images uploaded" });
//     }

//     const imageFilePaths = [];
//     for (let file of files) {
//       const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
//       const imgOutputPath = path.join(mountPath, imgFileName);

//       await useSharp(file.buffer, imgOutputPath);

//       imageFilePaths.push(`/public/${imgFileName}`);
//     }

//     const existingBlogImage = await NewBlogDescriptionImageModel.findById(editid).lean().exec();
//     if (!existingBlogImage) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     const updatedImagePaths = [...existingBlogImage.images, ...imageFilePaths];

//     const updatedBlogImage = await NewBlogDescriptionImageModel.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           selected_new_blog: selected_new_blog,
//           images: updatedImagePaths,
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     return res.status(200).json(updatedBlogImage);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put('/newblogimage/:editid', uploadConfig.array('newImages'), async (req, res) => {
  try {
    const { editid } = req.params;
    const { selected_new_blog, deletedImages } = req.body;

    const imagesToDelete = JSON.parse(deletedImages || '[]');

    const files = req.files;
    const imageFilePaths = [];
    if (files && files.length > 0) {
      for (let file of files) {
        const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
        const imgOutputPath = path.join(mountPath, imgFileName);
        await useSharp(file.buffer, imgOutputPath);
        imageFilePaths.push(`/public/${imgFileName}`);
      }
    }

    const existingBlog = await NewBlogDescriptionImageModel.findById(editid).exec();
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const updatedImages = existingBlog.images.filter((img) => !imagesToDelete.includes(`https://ekol-server-1.onrender.com${img}`));

    const finalImages = [...updatedImages, ...imageFilePaths];
    existingBlog.images = finalImages;
    existingBlog.selected_new_blog = selected_new_blog;

    // Save the updated blog
    const updatedBlog = await existingBlog.save();

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog images:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/newblogimage/:deleteid', async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await NewBlogDescriptionImageModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
});

// for front
router.get('/newblogimagefront', async (req, res) => {
  try {
    //     const acceptLanguage = req.headers["accept-language"];
    //     const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await NewBlogDescriptionImageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      selected_new_blog: data.selected_new_blog,
      images: data.images,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
