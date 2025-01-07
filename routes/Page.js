const express = require("express");
const router = express.Router();
const { uploadConfig, useSharp } = require("../config/MulterC");
const PageModel = require("../models/PageModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mountPath = require("../config/mountPath");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post("/page", checkUser, checkPermissions("create_page"), uploadConfig.single("imgback"), async (req, res) => {
  try {
    let imageFile = "";

    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);
      await useSharp(req.file.buffer, imgOutputPath);
      imageFile = `/public/${imgFileName}`;
    }

    const createData = new PageModel({
      dropdown_name: {
        az: req.body.dropdown_name,
        en: req.body.dropdown_name_en,
        ru: req.body.dropdown_name_ru,
      },
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
      status: req.body.status || true,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/page", checkUser, checkPermissions("list_page"), async (req, res) => {
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

router.put("/page/:editid", checkUser, checkPermissions("update_page"), uploadConfig.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const {
      title_az,
      title_en,
      title_ru,
      description_az,
      description_en,
      description_ru,
      path,
      dropdown_name,
      dropdown_name_en,
      dropdown_name_ru,
    } = req.body;

    const existingPage = await PageModel.findById(editid).exec();

    if (!existingPage) {
      return res.status(404).json({ error: "PageModel not found" });
    }

    const updatedPageData = {};

    if (dropdown_name) updatedPageData["dropdown_name.az"] = dropdown_name;
    if (dropdown_name_en) updatedPageData["dropdown_name.en"] = dropdown_name_en;
    if (dropdown_name_ru) updatedPageData["dropdown_name.ru"] = dropdown_name_ru;
    if (path) updatedPageData["path"] = path;
    if (title_az) updatedPageData["title.az"] = title_az;
    if (title_en) updatedPageData["title.en"] = title_en;
    if (title_ru) updatedPageData["title.ru"] = title_ru;
    if (description_az) updatedPageData["description.az"] = description_az;
    if (description_en) updatedPageData["description.en"] = description_en;
    if (description_ru) updatedPageData["description.ru"] = description_ru;

    let imageFile = "";

    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);  
      await useSharp(req.file.buffer, imgOutputPath); 
      imageFile = `/public/${imgFileName}`;
      updatedPageData.image = imageFile;
    } else if (existingPage.image) {
      updatedPageData.image = existingPage.image;
    }

    const updatedPage = await PageModel.findByIdAndUpdate(editid, { $set: updatedPageData }, { new: true }).exec();

    if (!updatedPage) {
      return res.status(404).json({ error: "Page not found for the provided editid" });
    }

    return res.status(200).json(updatedPage);
  } catch (error) {
    console.error("Error updating page data:", error);
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;


router.put("/page/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ error: "Status must be a boolean value" });
    }

    const updatedPage = await PageModel.findByIdAndUpdate(id, { status: status }, { new: true }).lean().exec();

    if (!updatedPage) {
      return res.status(404).json({ error: "PageModel not found" });
    }

    return res.status(200).json(updatedPage);
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/page/:deleteid", checkUser, checkPermissions("delete_page"), async (req, res) => {
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

    const datas = await PageModel.find({ status: true });
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      dropdown_name: data.dropdown_name[preferredLanguage],
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
