const express = require("express");
const router = express.Router();
const Blog = require("../models/BlogModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../config/MulterC");
const mountPath = require("../config/mountPath");

router.post("/blog", uploadConfig.single("imgback"), async (req, res) => {
  try {
    let imageFile = "";
    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);
      await useSharp(req.file.buffer, imgOutputPath);
      imageFile = `/public/${imgFileName}`;
    }

    const createData = new Blog({
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

router.get("/blog", async (req, res) => {
  try {
    const datas = await Blog.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/blog/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Blog.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/blog/:editid", uploadConfig.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru, status } = req.body;

    let imageFile = "";
    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);
      await useSharp(req.file.buffer, imgOutputPath);
      imageFile = `/public/${imgFileName}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
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
          created_at: req.body.created_at,
          updated: req.body.updated,
          image: imageFile,
          status: status,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedBlog) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/blog/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Blog.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/blogfront", async (req, res) => {
  try {
    const preferredLanguage = getPreferredLanguage(req);

    const datas = await Blog.find({ status: true });
    if (!datas.length) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map(formatBlogData(preferredLanguage));
    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/lastblogs", async (req, res) => {
  try {
    const preferredLanguage = getPreferredLanguage(req);

    const lastBlogs = await Blog.find({ status: true }).sort({ created_at: -1 }).limit(5).lean();
    if (!lastBlogs.length) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = lastBlogs.map(formatBlogData(preferredLanguage));
    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message, message: "Failed to fetch last blogs" });
  }
});

// Helper functions
function getPreferredLanguage(req) {
  const acceptLanguage = req.headers["accept-language"];
  return acceptLanguage.split(",")[0].split(";")[0];
}

function formatBlogData(preferredLanguage) {
  return (data) => ({
    _id: data._id,
    title: data.title[preferredLanguage],
    description: data.description[preferredLanguage],
    image: data.image,
    created_at: data.created_at,
    updated: data.updated,
  });
}

module.exports = router;
