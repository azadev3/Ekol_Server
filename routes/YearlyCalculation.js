const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const YearlyCalculations = require("../models/YearlyCalculationsModel");

router.post("/yearly_calculations", upload.single("pdf"), async (req, res) => {
  try {
    const requiredFields = ["title_az", "title_en", "title_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const pdfFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new YearlyCalculations({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      pdf: pdfFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/yearly_calculations", async (req, res) => {
  try {
    const datas = await YearlyCalculations.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/yearly_calculations/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await YearlyCalculations.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/yearly_calculations/:editid", upload.single("pdf"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru } = req.body;

    const updatedYearlyCalculations = await YearlyCalculations.findByIdAndUpdate(
      editid,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          pdf: req.file ? `/public/${req.file.filename}` : "",
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedYearlyCalculations) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedYearlyCalculations);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/yearly_calculations/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await YearlyCalculations.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/yearly_calculationsfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await YearlyCalculations.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      createdAt: data.createdAt,
      pdf: data.pdf,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
