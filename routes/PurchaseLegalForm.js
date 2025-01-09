const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const PurchaseLegalForm = require("../models/PurchaseLegalFormModel");
const nodemailer = require("nodemailer");

// Nodemailer configuration
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "azad.miri6@gmail.com",
//     pass: "xshk cxdb wgwx lxzk",
//   },
// });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'mail.ekol.az',
  port: 465,
  secure: true,
  auth: {
    user: 'website@ekol.az',
    pass: 'dtyx mlsf rhai vojh',
  },
});


router.post("/purchaseLegalForm", upload.single("requestpdf"), async (req, res) => {
  try {
    const requiredFields = [
      "country",
      "formMainType",
      "company",
      "voen",
      "name",
      "surname",
      "mobtel",
      "worktel",
      "email",
      "other",
      "job",
      "location",
      "enterprisename",
      "enterpriseNameOrTel",
      "enterprisepart",
      "typeofrequest",
      "message",
      "isResponsible",
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "satinalmalar@ekol.az",
      subject: "Yeni Hüquqi Şəxs Form Məlumatları",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Yeni Hüquqi Şəxs Form Məlumatları</h2>
        <p><strong>Şirkət:</strong>${req.body.company}</p>
        <p><strong>VÖEN:</strong> ${req.body.voen}</p>
        <p><strong>Ad:</strong> ${req.body.name}</p>
        <p><strong>Soyad:</strong> ${req.body.surname}</p>
        <p><strong>Mobil telefon:</strong> ${req.body.mobtel}</p>
        <p><strong>İş telefonu:</strong> ${req.body.worktel}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Digər:</strong> ${req.body.other}</p>
        <p><strong>Ölkə:</strong> ${req.body.country}</p>
        <p><strong>İş:</strong> ${req.body.job}</p>
        <p><strong>Ünvan:</strong> ${req.body.location}</p>
        <p><strong>Müəssisə adı:</strong> ${req.body.enterprisename}</p>
        <p><strong>Müəssisə adı və ya telefonu:</strong> ${req.body.enterpriseNameOrTel}</p>
        <p><strong>Müəssisə növü:</strong> ${req.body.enterprisepart}</p>
        <p><strong>Sorğu tipi:</strong> ${req.body.typeofrequest}</p>
        <p><strong>Message:</strong> ${req.body.message}</p>
        ${
          req.body.isResponsible
            ? `
        <p><strong>Müraciət edənin adı:</strong> ${req.body.namesecond}</p>
        <p><strong>Müraciət edənin soyadı:</strong> ${req.body.surnamesecond}</p>
        <p><strong>Müraciət edənin Mobil telefon nömrəsi:</strong> ${req.body.mobtelsecond}</p>
        <p><strong>Müraciət edənin İş telefon nömrəsi:</strong> ${req.body.worktelsecond}</p>
        <p><strong>Müraciət edənin E-mail:</strong> ${req.body.emailsecond}</p>
        <p><strong>Müraciət edənin digər məlumatları:</strong> ${req.body.othersecond}</p>
          `
            : ""
        }

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

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Form saved and email sent.", data: save });
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
router.get("/legalformfront", async (req, res) => {
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
