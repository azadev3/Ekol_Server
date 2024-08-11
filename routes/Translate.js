const express = require("express");
const router = express.Router();
const Translate = require("../models/TranslatesModel");

router.post("/translates", async (req, res) => {
  try {
    const { key, azTitle, enTitle, ruTitle } = req.body;

    if (!key || !azTitle || !enTitle || !ruTitle) {
      return res.status(400).json({ message: "missing fields" });
    }

    const newTranslates = new Translate({
      key: key,
      az: azTitle,
      en: enTitle,
      ru: ruTitle,
    });

    await newTranslates.save();

    return res.status(200).json(newTranslates);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/translates", async (req, res) => {
  try {
    const datas = await Translate.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/translates/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Translate.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/translates/:editid", async (req, res) => {
  try {
    const { editid } = req.params;
    const { azTitle, enTitle, ruTitle } = req.body;

    const updateTranslates = await Translate.findByIdAndUpdate(
      editid,
      {
        $set: {
          az: azTitle,
          en: enTitle,
          ru: ruTitle,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updateTranslates) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updateTranslates);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/translates/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Translate.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/translatesfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage ? acceptLanguage.split(",")[0].split(";")[0] : "en";

    const datas = await Translate.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const translatedData = datas.map((data) => ({
      key: data.key,
      text: data[preferredLanguage] || data["en"],
    }));

    return res.status(200).json(translatedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
