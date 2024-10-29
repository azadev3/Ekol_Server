const EquipmentsInnerDescription = require("../models/EquipmentInnerDescription");
const express = require("express");
const router = express.Router();
const { uploadConfig, useSharp } = require("../config/MulterC");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mountPath = require("../config/mountPath");
// Multiple file handling
router.post("/equipments-description", uploadConfig.array("imgeq", 10), async (req, res) => {
  try {
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

    const createData = new EquipmentsInnerDescription({
      description: {
        az: req.body.description_az,
        en: req.body.description_en,
        ru: req.body.description_ru,
      },
      images: imageFilePaths,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/equipments-description", async (req, res) => {
  try {
    const datas = await EquipmentsInnerDescription.find();
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

    const datasForId = await EquipmentsInnerDescription.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/equipments-description/:editid", uploadConfig.array("imgeq", 10), async (req, res) => {
  try {
    const { editid } = req.params;
    const { description_az, description_en, description_ru } = req.body;

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

    const updateInnerEQ = await EquipmentsInnerDescription.findByIdAndUpdate(
      editid,
      {
        $set: {
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
          images: imageFilePaths,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updateInnerEQ) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updateInnerEQ);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/equipments-description/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await EquipmentsInnerDescription.findByIdAndDelete(deleteid);

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

    const datas = await EquipmentsInnerDescription.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      description: data.description[preferredLanguage],
      images: data.images,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
