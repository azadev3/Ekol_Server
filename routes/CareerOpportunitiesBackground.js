const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const CareerOpportunitiesBackground = require("../models/CareerOpportunitiesBackground");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post(
  "/careerOpportunitiesBackground",
  checkUser,
  checkPermissions("create_karyeraimkanlari_arxafon_ve_basliq"),
  upload.single("imgback"),
  async (req, res) => {
    try {
      const imageFile = req.file ? `/public/${req.file.filename}` : "";

      const createData = new CareerOpportunitiesBackground({
        title: {
          az: req.body.title_az || '',
          en: req.body.title_en || '',
          ru: req.body.title_ru || '',
        },
        backgroundImage: imageFile,
      });

      const savedData = await createData.save();

      return res.status(200).json(savedData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/careerOpportunitiesBackground",
  checkUser,
  checkPermissions("list_karyeraimkanlari_arxafon_ve_basliq"),
  async (req, res) => {
    try {
      const datas = await CareerOpportunitiesBackground.find();
      if (!datas || datas.length === 0) {
        return res.status(404).json({ message: "No data found" });
      }
      return res.status(200).json(datas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/careerOpportunitiesBackground/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await CareerOpportunitiesBackground.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

//  router.put("/careerOpportunitiesBackground/:editid", upload.single("imgback"), async (req, res) => {
//    try {
//      const { editid } = req.params;
//      const { title_az, title_en, title_ru } = req.body;

//      const uptadedCareer = await CareerOpportunitiesBackground.findByIdAndUpdate(
//        editid,
//        {
//          $set: {
//            title: {
//              az: title_az,
//              en: title_en,
//              ru: title_ru,
//            },
//            backgroundImage: req.file ? `/public/${req.file.filename}` : "",
//          },
//        },
//        { new: true }
//      )
//        .lean()
//        .exec();

//      if (!uptadedCareer) {
//        return res.status(404).json({ error: "not found editid" });
//      }

//      return res.status(200).json(uptadedCareer);
//    } catch (error) {
//      console.error("Error updating data:", error);
//      return res.status(500).json({ error: error.message });
//    }
//  });

router.put(
  "/careerOpportunitiesBackground/:editid",
  checkUser,
  checkPermissions("update_karyeraimkanlari_arxafon_ve_basliq"),
  upload.single("imgback"),
  async (req, res) => {
    try {
      const { editid } = req.params;
      const { title_az, title_en, title_ru } = req.body;

      const existingCareer = await CareerOpportunitiesBackground.findById(editid).exec();
      if (!existingCareer) {
        return res.status(404).json({ error: "Career Opportunity not found" });
      }

      const updatedData = {};

      updatedData.title = {
        az: title_az !== undefined ? title_az : existingCareer.title.az,
        en: title_en !== undefined ? title_en : existingCareer.title.en,
        ru: title_ru !== undefined ? title_ru : existingCareer.title.ru,
      };
      

      if (req.file) {
        updatedData.backgroundImage = `/public/${req.file.filename}`;
      } else {
        updatedData.backgroundImage = existingCareer.backgroundImage;
      }

      if (Object.keys(updatedData).length === 0) {
        return res.status(200).json(existingCareer);
      }

      const updatedCareer = await CareerOpportunitiesBackground.findByIdAndUpdate(
        editid,
        { $set: updatedData },
        { new: true }
      )
        .lean()
        .exec();

      return res.status(200).json(updatedCareer);
    } catch (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/careerOpportunitiesBackground/:deleteid",
  checkUser,
  checkPermissions("delete_karyeraimkanlari_arxafon_ve_basliq"),
  async (req, res) => {
    try {
      const { deleteid } = req.params;
      const deleteData = await CareerOpportunitiesBackground.findByIdAndDelete(deleteid);

      if (!deleteData) {
        return res.status(404).json({ message: "dont delete data or not found data or another error" });
      }

      return res.status(200).json({ message: "successfully deleted data" });
    } catch (error) {}
  }
);

// for front
router.get("/careerOpportunitiesBackgroundForFront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await CareerOpportunitiesBackground.find();
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
