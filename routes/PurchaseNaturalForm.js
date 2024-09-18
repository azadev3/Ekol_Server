const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const PurchaseNaturalForm = require("../models/PurchaseNaturalFormModel");
const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "azad.miri6@gmail.com",
    pass: "xshk cxdb wgwx lxzk",
  },
});

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
      "country",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const pdfFile = req.file ? `/public/${req.file.filename}` : "";

    const savedData = new PurchaseNaturalForm({
      voen: req.body.voen,
      name: req.body.name,
      surname: req.body.surname,
      mobtel: req.body.mobtel,
      email: req.body.email,
      location: req.body.location,
      enterprisename: req.body.enterprisename,
      enterpriseNameOrTel: req.body.enterpriseNameOrTel,
      enterprisepart: req.body.enterprisepart,
      typeofrequest: req.body.typeofrequest,
      message: req.body.message,
      requestpdf: pdfFile,
      country: req.body.country,
    });

    const save = await savedData.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "kodingo593@gmail.com",
      subject: "Yeni Fərdi Şəxs Form Məlumatları",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Yeni Fərdi Şəxs Form Məlumatları</h2>
        <p><strong>VÖEN:</strong> ${req.body.voen}</p>
        <p><strong>Ad:</strong> ${req.body.name}</p>
        <p><strong>Soyad:</strong> ${req.body.surname}</p>
        <p><strong>Mobil telefon:</strong> ${req.body.mobtel}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Ölkə:</strong> ${req.body.country}</p>
        <p><strong>Ünvan:</strong> ${req.body.location}</p>
        <p><strong>Müəssisə adı:</strong> ${req.body.enterprisename}</p>
        <p><strong>Müəssisə əlaqə nömrəsi vəya adı:</strong> ${req.body.enterpriseNameOrTel}</p>
        <p><strong>Müsabiqə mərhələsi:</strong> ${req.body.enterprisepart}</p>
        <p><strong>Müraciətin növü:</strong> ${req.body.typeofrequest}</p>
        <p><strong>Mesaj:</strong> ${req.body.message}</p>
        <p>
        <strong>Fayl:</strong>
        ${req.file ? `https://ekol-server-1.onrender.com/public/${req.file.filename}` : ""},
        </p>
        
        <footer style="margin-top: 20px;">
          <p style="font-size: 16px; color: #777;">Bu mesaj avtomatik yaradıldı. Xahiş olunur cavablamayın.</p>
        </footer>
      </div>
    `,
    };

    return res.status(200).json(save);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteItemNat/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const findDataById = await PurchaseNaturalForm.findByIdAndDelete(id);
    if (!findDataById) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Item deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// for front
router.get("/purchaseNaturalFormFront", async (req, res) => {
  try {
    const datas = await PurchaseNaturalForm.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
