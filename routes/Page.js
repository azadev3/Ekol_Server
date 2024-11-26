const express = require("express");
const router = express.Router();
const { uploadConfig, useSharp } = require("../config/MulterC");
const PageModel = require("../models/PageModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mountPath = require("../config/mountPath");

router.post("/page", uploadConfig.single("imgback"), async (req, res) => {
  try {
    // Img
    const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
    const imgOutputPath = path.join(mountPath, imgFileName);
    await useSharp(req.file ? req.file.buffer : "", imgOutputPath);
    const imageFile = `/public/${imgFileName}`;

    const createData = new PageModel({
      path: req.body.path,
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
      image: imageFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/page", async (req, res) => {
  try {
    const datas = await PageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/page/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await PageModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/page/:editid", uploadConfig.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru, path } = req.body;

    const existingPage = await PageModel.findById(editid).exec();

    if (!existingPage) {
      return res.status(404).json({ error: "PageModel not found" });
    }

    const updatedPageData = {};

    if (path) updatedPageData["path"] = path;
    if (title_az) updatedPageData["title.az"] = title_az;
    if (title_en) updatedPageData["title.en"] = title_en;
    if (title_ru) updatedPageData["title.ru"] = title_ru;

    if (description_az) updatedPageData["description.az"] = description_az;
    if (description_en) updatedPageData["description.en"] = description_en;
    if (description_ru) updatedPageData["description.ru"] = description_ru;

    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);
      await useSharp(req.file.buffer, imgOutputPath);
      updatedPageData.image = `/public/${imgFileName}`;
    }

    const updatedPage = await PageModel.findByIdAndUpdate(editid, { $set: updatedPageData }, { new: true })
      .lean()
      .exec();

    if (!updatedPage) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedPage);
  } catch (error) {
    console.error("Error updating page data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/page/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await PageModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/pagefront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await PageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      path: data.path,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
