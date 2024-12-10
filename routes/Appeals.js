const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const Appeals = require('../models/AppealsModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');
const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
 host: 'smtp.gmail.com',
 port: 465,
 secure: true,
 auth: {
  user: 'azad.miri6@gmail.com',
  pass: 'xshk cxdb wgwx lxzk',
 },
});

router.post('/appeals', upload.none(), async (req, res) => {
 try {
  const requiredFields = ['name_surname', 'email', 'prefix', 'telephone', 'record'];

  for (let field of requiredFields) {
   if (!req.body[field]) {
    return res.status(400).json({ error: `Missing field: ${field}` });
   }
  }

  const createData = new Appeals({
   name_surname: req.body.name_surname,
   email: req.body.email,
   telephone: req.body.telephone,
   record: req.body.record,
   prefix: req.body.prefix,
  });

  const savedData = await createData.save();

  const mailOptions = {
   from: process.env.EMAIL_USER,
   to: 'kodingo593@gmail.com',
   subject: 'Yeni Müraciət',
   html: `
      <p><strong>Ad & Soyad:</strong> ${req.body.name_surname}</p>
      <p><strong>E-mail:</strong> ${req.body.email}</p>
      <p><strong>Telefon:</strong> ${req.body.telephone}</p>
      <p><strong>Mesaj:</strong> ${req.body.record}</p>
    `,
  };
  await transporter.sendMail(mailOptions);

  return res.status(200).json(savedData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.delete('/appeals/:deleteid', checkUser, checkPermissions('delete_muracietler'), async (req, res) => {
 try {
  const { deleteid } = req.params;
  const deleteData = await Appeals.findByIdAndDelete(deleteid);

  if (!deleteData) {
   return res.status(404).json({ message: 'dont delete data or not found data or another error' });
  }

  return res.status(200).json({ message: 'successfully deleted data' });
 } catch (error) {}
});

// for front
router.get('/appealsfront', checkUser, checkPermissions('list_muracietler'), async (req, res) => {
 try {
  const datas = await Appeals.find();
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }

  const filteredData = datas.map((data) => ({
   _id: data._id,
   name_surname: data.name_surname,
   email: data.email,
   telephone: data.telephone,
   record: data.record,
   prefix: data.prefix,
  }));

  return res.status(200).json(filteredData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});
module.exports = router;
