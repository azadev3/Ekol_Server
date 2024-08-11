const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Imagespage = require("../models/ImagesPageModel");

// POST endpoint
router.post("/imagespage", upload.fields([{ name: "imgback", maxCount: 1 }, { name: "images" }]), async (req, res) => {
  try {
    const requiredFields = ["categoryName_az", "categoryName_en", "categoryName_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const categoryImgFile = req.files["imgback"] ? `/public/${req.files["imgback"][0].filename}` : "";

    const images = req.files["images"]
      ? req.files["images"].map((file) => ({ image: `/public/${file.filename}` }))
      : [];

    const createData = new Imagespage({
      categoryName: {
        az: req.body.categoryName_az,
        en: req.body.categoryName_en,
        ru: req.body.categoryName_ru,
      },
      categoryImg: categoryImgFile,
      images: images,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    console.error("Error saving data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/imagespage", async (req, res) => {
  try {
    const datas = await Imagespage.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/imagespage/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Imagespage.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put(
  "/imagespage/:editid",
  upload.fields([{ name: "imgback", maxCount: 1 }, { name: "images" }]),
  async (req, res) => {
    try {
      const { editid } = req.params;
      const { categoryName_az, categoryName_en, categoryName_ru } = req.body;

      const categoryImgFile = req.files["imgback"] ? `/public/${req.files["imgback"][0].filename}` : undefined;
      const images = req.files["images"]
        ? req.files["images"].map((file) => ({ image: `/public/${file.filename}` }))
        : undefined;

      const updateData = {
        categoryName: {
          az: categoryName_az,
          en: categoryName_en,
          ru: categoryName_ru,
        },
        ...(categoryImgFile && { categoryImg: categoryImgFile }),
        ...(images && { images: images }),
      };

      const updatedImagespage = await Imagespage.findByIdAndUpdate(editid, { $set: updateData }, { new: true })
        .lean()
        .exec();

      if (!updatedImagespage) {
        return res.status(404).json({ error: "Not found: editid" });
      }

      return res.status(200).json(updatedImagespage);
    } catch (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/imagespage/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Imagespage.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/imagespagefront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await Imagespage.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    const filteredData = datas.map((data) => ({
      categoryName: data.categoryName[preferredLanguage],
      categoryImg: data.categoryImg,
      images: data.images,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
