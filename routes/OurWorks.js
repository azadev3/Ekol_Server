const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const OurWorks = require("../models/OurWorksModel");
const checkUser = require("../middlewares/checkUser");
const checkPermission = require("../middlewares/checkPermissions");

router.post("/ourworks", checkUser, checkPermission("create_gorduyumuz_isler"), upload.single("imgback"), async (req, res) => {
  try {
    const requiredFields = ["title_az", "title_en", "title_ru", "description_az", "description_en", "description_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const imageFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new OurWorks({
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
      image: imageFile ? imageFile : "",
      statusActive: req.body.statusActive || true,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ourworks", checkUser, checkPermission("list_gorduyumuz_isler"), async (req, res) => {
  try {
    const datas = await OurWorks.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ourworks/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await OurWorks.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/ourworks/:editid", upload.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

//     const updatedOurWorks = await OurWorks.findByIdAndUpdate(
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
//           image: req.file ? `/public/${req.file.filename}` : "",
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedOurWorks) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedOurWorks);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });


router.put("/ourworks/:editid", checkUser, checkPermission("update_gorduyumuz_isler"), upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const existingOurWorks = await OurWorks.findById(editid).exec();
    if (!existingOurWorks) {
      return res.status(404).json({ error: "Not found: editid" });
    }

    const updateData = {
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
    };

    if (req.file) {
      updateData.image = `/public/${req.file.filename}`;
    }

    const updatedOurWorks = await OurWorks.findByIdAndUpdate(editid, { $set: updateData }, { new: true })
      .lean()
      .exec();

    if (!updatedOurWorks) {
      return res.status(404).json({ error: "Not found: editid" });
    }

    return res.status(200).json(updatedOurWorks);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/ourworks/:deleteid", checkUser, checkPermission("delete_gorduyumuz_isler"), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await OurWorks.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});


router.put("/ourworks/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActive } = req.body;

    if (typeof statusActive !== "boolean") {
      return res.status(400).json({ error: "Status must be a boolean value" });
    }

    const updatedPurch = await OurWorks.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

    if (!updatedPurch) {
      return res.status(404).json({ error: " not found" });
    }

    return res.status(200).json(updatedPurch);
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: error.message });
  }
});

// for front
router.get("/ourworksfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await OurWorks.find({ statusActive: true });
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
