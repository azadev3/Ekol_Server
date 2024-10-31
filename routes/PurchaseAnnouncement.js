const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const PurchaseAnnouncement = require("../models/PurchaseAnnouncementModel");

router.post("/purchaseannouncement", upload.single("pdf"), async (req, res) => {
  try {
    const pdfFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new PurchaseAnnouncement({
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
      predmet: {
        az: req.body.predmet_az,
        en: req.body.predmet_en,
        ru: req.body.predmet_ru,
      },
      end_date: req.body.end_date,
      pdf: pdfFile,
      status: req.body?.status,
      statusActive: req.body.statusActive || true,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/purchaseannouncement", async (req, res) => {
  try {
    const datas = await PurchaseAnnouncement.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/purchaseannouncement/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await PurchaseAnnouncement.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/purchaseannouncement/:editid", upload.single("pdf"), async (req, res) => {
  try {
    const { editid } = req.params;
    const {
      title_az,
      title_en,
      title_ru,
      description_az,
      description_en,
      description_ru,
      predmet_az,
      predmet_en,
      predmet_ru,
      end_date,
      status,
    } = req.body;

    const updatedPurchase = await PurchaseAnnouncement.findByIdAndUpdate(
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
          predmet: {
            az: predmet_az,
            en: predmet_en,
            ru: predmet_ru,
          },
          end_date: end_date,
          status: status,
          pdf: req.file ? `/public/${req.file.filename}` : "",
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedPurchase) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedPurchase);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/purch/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActive } = req.body;

    if (typeof statusActive !== "boolean") {
      return res.status(400).json({ error: "Status must be a boolean value" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/purchaseannouncement/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await PurchaseAnnouncement.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/purchaseannouncementfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await PurchaseAnnouncement.find({ statusActive: true });
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      predmet: data.predmet[preferredLanguage],
      createdAt: data.createdAt,
      end_date: data.end_date,
      pdf: data.pdf,
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
