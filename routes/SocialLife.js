const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const SocialLife = require("../models/SocialLifeModel");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post("/sociallife", checkUser, checkPermissions("create_sosial_heyat"), upload.none(), async (req, res) => {
  try {
    const requiredFields = ["description_az", "description_en", "description_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const createData = new SocialLife({
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

router.get("/sociallife", checkUser, checkPermissions("list_sosial_heyat"), async (req, res) => {
  try {
    const datas = await SocialLife.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/sociallife/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await SocialLife.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/sociallife/:editid", checkUser, checkPermissions("update_sosial_heyat"), upload.none(), async (req, res) => {
  try {
    const { editid } = req.params;
    const { description_az, description_en, description_ru } = req.body;

    const updatedSocialLife = await SocialLife.findByIdAndUpdate(
      editid,
      {
        $set: {
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

    if (!updatedSocialLife) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedSocialLife);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/sociallife/:deleteid", checkUser, checkPermissions("delete_sosial_heyat"), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await SocialLife.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/sociallifefront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await SocialLife.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      description: data.description[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
