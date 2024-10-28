const express = require("express");
const router = express.Router();
const { uploadConfig } = require("../config/MulterC");
const StructureCategoriesModel = require("../models/StructureCategoriesModel");

router.post("/departmentscategories", uploadConfig.none(), async (req, res) => {
  try {
    const createData = new StructureCategoriesModel({
      title: {
        az: req.body.title_az,
        en: req.body.title_en,
        ru: req.body.title_ru,
      },
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/departmentscategories", async (req, res) => {
  try {
    const datas = await StructureCategoriesModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/departmentscategories/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await StructureCategoriesModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/departmentscategories/:editid", uploadConfig.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const updateCategoryStructure = await StructureCategoriesModel.findByIdAndUpdate(
      editid,
      {
        $set: {
          title: {
            az: req.body.title_az,
            en: req.body.title_en,
            ru: req.body.title_ru,
          },
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updateCategoryStructure) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updateCategoryStructure);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/departmentscategories/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await StructureCategoriesModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/departmentscategoriesfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await StructureCategoriesModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
