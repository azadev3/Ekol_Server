const express = require("express");
const router = express.Router();
const OurWorksInner = require("../models/OurworksinnerModel");
const upload = require("../config/MulterConfig");

router.post("/ourworksinner", upload.none(), async (req, res) => {
  try {

    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    if(!title_az || !title_en || !title_ru || !description_az || !description_en || !description_ru) {
      return res.status(400).json({ error: `Missing field` });
    }

    const createData = new OurWorksInner({
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
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ourworksinner", async (req, res) => {
  try {
    const datas = await OurWorksInner.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ourworksinner/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await OurWorksInner.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/ourworksinner/:editid", upload.none(),  async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const updatedOurWorksInner = await OurWorksInner.findByIdAndUpdate(
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
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedOurWorksInner) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedOurWorksInner);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/ourworksinner/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await OurWorksInner.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/ourworksinnerfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await OurWorksInner.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
