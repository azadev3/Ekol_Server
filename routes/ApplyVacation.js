const express = require('express');
const upload = require('../config/MulterConfig');
const router = express.Router();
const ApplyVacation = require('../models/ApplyVacationModel');
const nodemailer = require('nodemailer');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

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
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: 'website@ekol.az',
    pass: 'dtyx mlsf rhai vojh',
  },
});

router.post(
  '/applyvacation',
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userProfile = req.files['profile'] ? `/public/${req.files['profile'][0].filename}` : '';
      const cv = req.files['cv'] ? `/public/${req.files['cv'][0].filename}` : '';

      const requiredFields = ['email', 'name', 'surname', 'telephone', 'apply_vacation_name', 'applyDate'];
      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ error: `Missing field: ${field}` });
        }
      }

      const saveData = new ApplyVacation({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        telephone: req.body.telephone,
        profile: userProfile,
        cv: cv,
        apply_vacation_name: req.body.apply_vacation_name,
        applyDate: req.body.applyDate,
      });

      const savedData = await saveData.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'hr@ekol.az',
        subject: 'Vakansiya müraciəti',
        html: `
          <h1>Vakansiya müraciəti</h1>
          <p><strong>Ad:</strong> ${req.body.name} ${req.body.surname}</p>
          <p><strong>E-mail:</strong> ${req.body.email}</p>
          <p><strong>Telefon:</strong> ${req.body.telephone}</p>
          <p><strong>Vakansiya adı:</strong> ${req.body.apply_vacation_name}</p>
          <p><strong>Müraciət tarixi:</strong> ${req.body.applyDate}</p>
        <p>
        <strong>CV:</strong>
        ${`https://ekol-server-1.onrender.com${cv}`};
        </p>

             <footer style="margin-top: 20px;">
          <p style="font-size: 16px; color: #777;">Bu mesaj avtomatik yaradıldı. Xahiş olunur cavablamayın.</p>
        </footer>
        `,
      };
      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: 'Muraciet muveffeqiyyetle save olundu ve e-posta gönderildi.',
        savedUserData: savedData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.get('/applyvacation', checkUser, checkPermissions('list_vakansiya_muracietleri'), async (req, res) => {
  try {
    const datas = await ApplyVacation.find().lean().exec();
    if (!datas) {
      return res.status(404).json({ message: 'datas is null' });
    }

    return res.status(200).json({ data: datas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/applyvacation/:apply_id', checkUser, checkPermissions('delete_vakansiya_muracietleri'), async (req, res) => {
  try {
    const { apply_id } = req.params;

    const removeApply = await ApplyVacation.findByIdAndDelete(apply_id);

    if (!removeApply) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
