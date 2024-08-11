const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Management = require("../models/ManagementModel");

router.post("/management", upload.single("imgback"), async (req, res) => {
  try {
    const requiredFields = [
      "nameSurname_az",
      "nameSurname_en",
      "nameSurname_ru",
      "job_az",
      "job_en",
      "job_ru",
      "education_az",
      "education_en",
      "education_ru",
      "description_az",
      "description_en",
      "description_ru",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const imageFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new Management({
      nameSurname: {
        az: req.body.nameSurname_az,
        en: req.body.nameSurname_en,
        ru: req.body.nameSurname_ru,
      },
      job: {
        az: req.body.job_az,
        en: req.body.job_en,
        ru: req.body.job_ru,
      },
      profile: imageFile,
      description: {
        az: req.body.description_az,
        en: req.body.description_en,
        ru: req.body.description_ru,
      },
      education: {
        az: req.body.education_az,
        en: req.body.education_en,
        ru: req.body.education_ru,
      },
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/management", async (req, res) => {
  try {
    const datas = await Management.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/management/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Management.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/management/:editid", upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const {
      nameSurname_az,
      nameSurname_en,
      nameSurname_ru,
      job_az,
      job_en,
      job_ru,
      education_az,
      education_en,
      education_ru,
      description_az,
      description_en,
      description_ru,
    } = req.body;

    const updatedManagement = await Management.findByIdAndUpdate(
      editid,
      {
        $set: {
          nameSurname: {
            az: nameSurname_az,
            en: nameSurname_en,
            ru: nameSurname_ru,
          },
          job: {
            az: job_az,
            en: job_en,
            ru: job_ru,
          },
          profile: req.file ? `/public/${req.file.filename}` : "",
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
          education: {
            az: education_az,
            en: education_en,
            ru: education_ru,
          },
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedManagement) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedManagement);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/management/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Management.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/managementfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await Management.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      nameSurname: data.nameSurname[preferredLanguage],
      job: data.job[preferredLanguage],
      profile: data.profile,
      description: data.description[preferredLanguage],
      education: data.education[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
