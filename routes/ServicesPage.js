const express = require("express");
const router = express.Router();
const ServicesPage = require("../models/ServicesPageModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../config/MulterC");
const mountPath = require("../config/mountPath");

router.post("/servicespage", uploadConfig.single("imgback"), async (req, res) => {
  try {
    // Img
    let imageFile = "";

    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(req.file.buffer, imgOutputPath);

      imageFile = `/public/${imgFileName}`;
    }

    const createData = new ServicesPage({
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

router.get("/servicespage", async (req, res) => {
  try {
    const datas = await ServicesPage.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/servicespage/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await ServicesPage.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/servicespage/:editid", uploadConfig.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    // Img
    let imageFile = "";

    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(req.file.buffer, imgOutputPath);

      imageFile = `/public/${imgFileName}`;
    }

    const updatedservicespage = await ServicesPage.findByIdAndUpdate(
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
          image: imageFile,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedservicespage) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedservicespage);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/servicespage/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await ServicesPage.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/servicespagefront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await ServicesPage.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
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
