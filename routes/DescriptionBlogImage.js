const BlogDescriptionImageModel = require("../models/BlogDescriptionImageModel");
const express = require("express");
const router = express.Router();
const { uploadConfig, useSharp } = require("../config/MulterC");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mountPath = require("../config/mountPath");
// Multiple file handling
router.post("/blogimage", uploadConfig.array("imgback", 10), async (req, res) => {
  try {
    const files = req.files;
    const selected_blog = req.body.selected_blog;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const imageFilePaths = [];
    for (let file of files) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(file.buffer, imgOutputPath);

      imageFilePaths.push(`/public/${imgFileName}`);
    }

    const createData = new BlogDescriptionImageModel({
      selected_blog,
      images: imageFilePaths,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/blogimage", async (req, res) => {
  try {
    const datas = await BlogDescriptionImageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/blogimage/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await BlogDescriptionImageModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/blogimage/:editid", uploadConfig.array("imgback", 10), async (req, res) => {
  try {
    const { editid } = req.params;
    const { selected_blog } = req.body;

    // Img
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const imageFilePaths = [];
    for (let file of files) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(file.buffer, imgOutputPath);

      imageFilePaths.push(`/public/${imgFileName}`);
    }

    const updatedBlogImage = await BlogDescriptionImageModel.findByIdAndUpdate(
      editid,
      {
        $set: {
          selected_blog: selected_blog,
          images: imageFilePaths,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedBlogImage) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedBlogImage);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/blogimage/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await BlogDescriptionImageModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/blogimagefront", async (req, res) => {
  try {
    //     const acceptLanguage = req.headers["accept-language"];
    //     const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await BlogDescriptionImageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      selected_blog: data.selected_blog,
      images: data.images,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
