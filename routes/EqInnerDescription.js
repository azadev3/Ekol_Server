const express = require("express");
const router = express.Router();
const { uploadConfig, useSharp } = require("../config/MulterC");
const EquipmentInnerDescription = require("../models/EquipmentInnerDescription");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mountPath = require("../config/mountPath");

router.post("/equipments-description", uploadConfig.single("imgback"), async (req, res) => {
  try {
    // Img
    const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
    const imgOutputPath = path.join(mountPath, imgFileName);
    await useSharp(req.file ? req.file.buffer : "", imgOutputPath);
    const imageFile = `/public/${imgFileName}`;

    const createData = new EquipmentInnerDescription({
      description: {
        az: req.body.description_az,
        en: req.body.description_en,
        ru: req.body.description_ru,
      },
      image: imageFile,
      selected_eq: req.body.selected_eq,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/equipments-description", async (req, res) => {
  try {
    const datas = await EquipmentInnerDescription.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/equipments-description/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await EquipmentInnerDescription.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/equipments-description/:editid", uploadConfig.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    // Img
    const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
    const imgOutputPath = path.join("./public", imgFileName);
    await useSharp(req.file ? req.file.buffer : "", imgOutputPath);
    const imageFile = `/public/${imgFileName}`;

    const updatedEquipmentsDescriptions = await EquipmentInnerDescription.findByIdAndUpdate(
      editid,
      {
        $set: {
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
          image: imageFile,
          selected_eq: req.body.selected_eq,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedEquipmentsDescriptions) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedEquipmentsDescriptions);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/equipments-description/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await EquipmentInnerDescription.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/equipmentsdescriptionfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await EquipmentInnerDescription.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      description: data.description[preferredLanguage],
      image: data.image,
      selected_eq: data.selected_eq,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
