const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const GalleryDropdown = require("../models/GalleryDropdownModel");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post("/gallerydropdown", checkUser, checkPermissions("create_qalereya_sehifesi"), upload.single("imgback"), async (req, res) => {
  try {
    const requiredFields = ["title_az", "title_en", "title_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const imageFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new GalleryDropdown({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
      backgroundImage: imageFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/gallerydropdown", checkUser, checkPermissions("list_qalereya_sehifesi"), async (req, res) => {
  try {
    const datas = await GalleryDropdown.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/gallerydropdown/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await GalleryDropdown.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/gallerydropdown/:editid", upload.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru } = req.body;

//     const updatedGalleryDropdown = await GalleryDropdown.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           title: {
//             az: title_az,
//             en: title_en,
//             ru: title_ru,
//           },
//           backgroundImage: req.file ? `/public/${req.file.filename}` : "",
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedGalleryDropdown) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedGalleryDropdown);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put("/gallerydropdown/:editid", checkUser, checkPermissions("update_qalereya_sehifesi"), upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru } = req.body;

    const existingGalleryDropdown = await GalleryDropdown.findById(editid).exec();
    if (!existingGalleryDropdown) {
      return res.status(404).json({ error: "GalleryDropdown not found" });
    }
    const updatedData = {};

    updatedData.title = {
      az: title_az || existingGalleryDropdown.title.az,
      en: title_en || existingGalleryDropdown.title.en,
      ru: title_ru || existingGalleryDropdown.title.ru,
    };

    let backgroundImage = existingGalleryDropdown.backgroundImage || "";
    if (req.file) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);
      await useSharp(req.file.buffer, imgOutputPath);
      backgroundImage = `/public/${imgFileName}`;
    }

    updatedData.backgroundImage = backgroundImage; 

    if (Object.keys(updatedData).length === 0) {
      return res.status(200).json(existingGalleryDropdown);
    }

    const updatedGallery = await GalleryDropdown.findByIdAndUpdate(
      editid,
      { $set: updatedData },
      { new: true }
    )
      .lean()
      .exec();

    return res.status(200).json(updatedGallery);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/gallerydropdown/:deleteid", checkUser, checkPermissions("delete_qalereya_sehifesi"), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await GalleryDropdown.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front

router.get("/gallerydropdownfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await GalleryDropdown.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      title: data.title[preferredLanguage],
      backgroundImage: data.backgroundImage,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
