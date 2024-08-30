const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const PurchaseLegalForm = require("../models/PurchaseLegalFormModel");

router.post("/purchaseNaturalForm", upload.single("requestpdf"), async (req, res) => {
  try {
    const requiredFields = [
      "voen",
      "name",
      "surname",
      "mobtel",
      "email",
      "location",
      "enterprisename",
      "enterpriseNameOrTel",
      "enterprisepart",
      "typeofrequest",
      "message",
      "requestpdf",
      "country",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const pdfFile = req.file ? `/public/${req.file.filename}` : "";

    const savedData = new PurchaseLegalForm({
      company: req.body.company,
      voen: req.body.voen,
      name: req.body.name,
      surname: req.body.surname,
      mobtel: req.body.mobtel,
      worktel: req.body.worktel,
      email: req.body.email,
      other: req.body.other,
      country: req.body.country,
      job: req.body.job,
      location: req.body.location,
      enterprisename: req.body.enterprisename,
      enterpriseNameOrTel: req.body.enterpriseNameOrTel,
      enterprisepart: req.body.enterprisepart,
      typeofrequest: req.body.typeofrequest,
      requestpdf: pdfFile,
      message: req.body.message,
      isResponsible: req.body.isResponsible,
      namesecond: req.body.namesecond || "",
      surnamesecond: req.body.surnamesecond || "",
      mobtelsecond: req.body.mobtelsecond || "",
      worktelsecond: req.body.worktelsecond || "",
      emailsecond: req.body.emailsecond || "",
      othersecond: req.body.othersecond || "",
    });

    const save = await savedData.save();
    return res.status(200).json(save);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteItem/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const findDataById = await PurchaseLegalForm.findByIdAndDelete(id);
    if (!findDataById) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// for front
router.get("/purchaseNaturalFormFront", async (req, res) => {
  try {
    const datas = await PurchaseLegalForm.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
