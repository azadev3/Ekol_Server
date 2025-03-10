const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Purchase = require("../models/PurchaseModel");

router.post("/purchase", upload.single("pdf"), async (req, res) => {
  try {
    const requiredFields = ["title_az", "title_en", "title_ru", "description_az", "description_en", "description_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const pdfFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new Purchase({
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
      pdf: pdfFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/purchase", async (req, res) => {
  try {
    const datas = await Purchase.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/purchase/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Purchase.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/purchase/:editid", upload.single("pdf"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

//     const updatedPurchase = await Purchase.findByIdAndUpdate(
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
//           pdf: req.file ? `/public/${req.file.filename}` : "",
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedPurchase) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedPurchase);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put("/purchase/:editid", upload.single("pdf"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const existingPurchase = await Purchase.findById(editid).exec();
    if (!existingPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    const updatedData = {};

    if (title_az || title_en || title_ru) {
      updatedData.title = {
        az: title_az || existingPurchase.title.az,
        en: title_en || existingPurchase.title.en,
        ru: title_ru || existingPurchase.title.ru,
      };
    }

    if (description_az || description_en || description_ru) {
      updatedData.description = {
        az: description_az || existingPurchase.description.az,
        en: description_en || existingPurchase.description.en,
        ru: description_ru || existingPurchase.description.ru,
      };
    }

    if (req.file) {
      updatedData.pdf = `/public/${req.file.filename}`;
    } else {
      updatedData.pdf = existingPurchase.pdf; 
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(200).json(existingPurchase);
    }

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      editid,
      { $set: updatedData },
      { new: true }
    )
      .lean()
      .exec();

    return res.status(200).json(updatedPurchase);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/purchase/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Purchase.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/purchasefront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await Purchase.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      createdAt: data.createdAt,
      pdf: data.pdf,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
