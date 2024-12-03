const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const WhyEcol = require("../models/WhyEcolModel");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post("/whyecol", checkUser, checkPermissions("create_niye_ekol"), upload.single("imgback"), async (req, res) => {
  try {
    const requiredFields = ["title_az", "title_en", "title_ru", "description_az", "description_en", "description_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const imageFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new WhyEcol({
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
      icon: imageFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/whyecol", checkUser, checkPermissions("list_niye_ekol"), async (req, res) => {
  try {
    const datas = await WhyEcol.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/whyecol/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await WhyEcol.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/whyecol/:editid", upload.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

//     const updatedWhyEcolData = await WhyEcol.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           title: {
//             az: title_az,
//             en: title_en,
//             ru: title_ru,
//           },
//           description: {
//             az: description_az,
//             en: description_en,
//             ru: description_ru,
//           },
//           icon: req.file ? `/public/${req.file.filename}` : "",
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedWhyEcolData) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedWhyEcolData);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put("/whyecol/:editid", checkUser, checkPermissions("update_niye_ekol"), upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const existingWhyEcolData = await WhyEcol.findById(editid).exec();
    if (!existingWhyEcolData) {
      return res.status(404).json({ error: "WhyEcol not found" });
    }

    const updatedData = {};

    updatedData.title = {
      az: title_az || existingWhyEcolData.title.az,
      en: title_en || existingWhyEcolData.title.en,
      ru: title_ru || existingWhyEcolData.title.ru,
    };

    updatedData.description = {
      az: description_az || existingWhyEcolData.description.az,
      en: description_en || existingWhyEcolData.description.en,
      ru: description_ru || existingWhyEcolData.description.ru,
    };

    if (req.file) {
      updatedData.icon = `/public/${req.file.filename}`;
    } else {
      updatedData.icon = existingWhyEcolData.icon; 
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(200).json(existingWhyEcolData);
    }

    const updatedWhyEcol = await WhyEcol.findByIdAndUpdate(
      editid,
      { $set: updatedData },
      { new: true }
    )
      .lean()
      .exec();

    return res.status(200).json(updatedWhyEcol);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/whyecol/:deleteid", checkUser, checkPermissions("delete_niye_ekol"), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await WhyEcol.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/whyecolfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await WhyEcol.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      icon: data.icon,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
