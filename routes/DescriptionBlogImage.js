const BlogDescriptionImageModel = require("../models/BlogDescriptionImageModel");
const express = require("express");
const router = express.Router();
const { uploadConfig, useSharp } = require("../config/MulterC");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mountPath = require("../config/mountPath");

// Multiple file upload handling
router.post("/blogimage", uploadConfig.array("imgback"), async (req, res) => {
  try {
    const files = req.files;
    const selected_blog = req.body.selected_blog;

    if (!selected_blog) {
      return res.status(400).json({ error: "selected_blog field is required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const imageFilePaths = await Promise.all(
      files.map(async (file) => {
        const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
        const imgOutputPath = path.join(mountPath, imgFileName);
        await useSharp(file.buffer, imgOutputPath);
        return `/public/${imgFileName}`;
      })
    );

    const newBlogImage = new BlogDescriptionImageModel({
      selected_blog,
      images: imageFilePaths,
    });

    const savedData = await newBlogImage.save();
    return res.status(200).json(savedData);
  } catch (error) {
    console.error("Error saving blog image:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get all blog images
router.get("/blogimage", async (req, res) => {
  try {
    const datas = await BlogDescriptionImageModel.find();
    if (!datas.length) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get a blog image by ID
router.get("/blogimage/:editid", async (req, res) => {
  try {
    const { editid } = req.params;
    const data = await BlogDescriptionImageModel.findById(editid).lean().exec();

    if (!data) {
      return res.status(404).json({ error: "Blog image not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Update a blog image
router.put("/blogimage/:editid", uploadConfig.array("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { selected_blog } = req.body;
    const files = req.files;

    if (!selected_blog) {
      return res.status(400).json({ error: "selected_blog field is required" });
    }

    const imageFilePaths = files?.length
      ? await Promise.all(
          files.map(async (file) => {
            const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
            const imgOutputPath = path.join(mountPath, imgFileName);
            await useSharp(file.buffer, imgOutputPath);
            return `/public/${imgFileName}`;
          })
        )
      : [];

    const updatedBlogImage = await BlogDescriptionImageModel.findByIdAndUpdate(
      editid,
      { $set: { selected_blog, ...(imageFilePaths.length && { images: imageFilePaths }) } },
      { new: true }
    ).lean();

    if (!updatedBlogImage) {
      return res.status(404).json({ error: "Blog image not found for update" });
    }
    return res.status(200).json(updatedBlogImage);
  } catch (error) {
    console.error("Error updating blog image:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete a blog image
router.delete("/blogimage/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deletedData = await BlogDescriptionImageModel.findByIdAndDelete(deleteid);

    if (!deletedData) {
      return res.status(404).json({ error: "Blog image not found for deletion" });
    }
    return res.status(200).json({ message: "Successfully deleted blog image" });
  } catch (error) {
    console.error("Error deleting blog image:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get blog images for the frontend
router.get("/blogimagefront", async (req, res) => {
  try {
    const datas = await BlogDescriptionImageModel.find();
    if (!datas.length) {
      return res.status(404).json({ message: "No data found" });
    }
    const filteredData = datas.map((data) => ({
      _id: data._id,
      selected_blog: data.selected_blog,
      images: data.images,
    }));
    return res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error fetching data for frontend:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
