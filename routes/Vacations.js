const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Vacations = require("../models/VacationsModel");

router.post("/vacations", upload.none(), async (req, res) => {
  try {
    const requiredFields = [
      "title_az",
      "title_en",
      "title_ru",
      "description_az",
      "description_en",
      "description_ru",
      "location_az",
      "location_en",
      "location_ru",
      "workRegime_az",
      "workRegime_en",
      "workRegime_ru",
      "end_date",
      "start_date",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }
    const createData = new Vacations({
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
      location: {
        az: req.body.location_az,
        en: req.body.location_en,
        ru: req.body.location_ru,
      },
      workRegime: {
        az: req.body.workRegime_az,
        en: req.body.workRegime_en,
        ru: req.body.workRegime_ru,
      },
      endDate: req.body.end_date,
      startDate: req.body.start_date,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/vacations", async (req, res) => {
  try {
    const datas = await Vacations.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/vacations/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Vacations.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/vacations/:editid", upload.none(), async (req, res) => {
  try {
    const { editid } = req.params;
    const {
      title_az,
      title_en,
      title_ru,
      description_az,
      description_en,
      description_ru,
      location_az,
      location_en,
      location_ru,
      workRegime_az,
      workRegime_en,
      workRegime_ru,
      start_date,
      end_date,
    } = req.body;

    const updatedVacations = await Vacations.findByIdAndUpdate(
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
          location: {
            az: location_az,
            en: location_en,
            ru: location_ru,
          },
          workRegime: {
            az: workRegime_az,
            en: workRegime_en,
            ru: workRegime_ru,
          },
          startDate: start_date,
          endDate: end_date,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedVacations) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedVacations);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/vacations/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Vacations.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/vacationsfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await Vacations.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      location: data.location[preferredLanguage],
      workRegime: data.workRegime[preferredLanguage],
      startDate: data.startDate,
      endDate: data.endDate,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
