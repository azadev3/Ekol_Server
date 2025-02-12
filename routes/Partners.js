const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const Partners = require('../models/PartnersModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post(
 '/partners',
 checkUser,
 checkPermissions('create_partnyorlar'),
 upload.single('imgback'),
 async (req, res) => {
  try {
   const requiredFields = ['title_az', 'title_en', 'title_ru'];

   for (let field of requiredFields) {
    if (!req.body[field]) {
     return res.status(400).json({ error: `Missing field: ${field}` });
    }
   }

   const imgfile = req.file ? `/public/${req.file.filename}` : '';

   const createData = new Partners({
    title: {
     az: req.body.title_az,
     en: req.body.title_en,
     ru: req.body.title_ru,
    },
    logo: imgfile,
    statusActive: req.body.statusActive || true,
   });

   const savedData = await createData.save();

   return res.status(200).json(savedData);
  } catch (error) {
   return res.status(500).json({ error: error.message });
  }
 }
);

router.get('/partners', checkUser, checkPermissions('list_partnyorlar'), async (req, res) => {
 try {
  const datas = await Partners.find();
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }
  return res.status(200).json(datas);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.get('/partners/:editid', async (req, res) => {
 try {
  const { editid } = req.params;

  const datasForId = await Partners.findById(editid).lean().exec();

  if (!datasForId) {
   return res.status(404).json({ error: 'not found editid' });
  }

  return res.status(200).json(datasForId);
 } catch (error) {
  console.error('Error fetching data:', error);
  return res.status(500).json({ error: error.message });
 }
});

// router.put("/partners/:editid", upload.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru } = req.body;

//     const imgfile = req.file ? `/public/${req.file.filename}` : "";

//     const updatedPartners = await Partners.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           title: {
//             az: title_az,
//             en: title_en,
//             ru: title_ru,
//           },
//           logo: imgfile,
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedPartners) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedPartners);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put(
 '/partners/:editid',
 checkUser,
 checkPermissions('update_partnyorlar'),
 upload.single('imgback'),
 async (req, res) => {
  try {
   const { editid } = req.params;
   const { title_az, title_en, title_ru } = req.body;

   const existingPartner = await Partners.findById(editid).exec();
   if (!existingPartner) {
    return res.status(404).json({ error: 'Not found: editid' });
   }

   const updateData = {
    title: {
     az: title_az,
     en: title_en,
     ru: title_ru,
    },
   };

   if (req.file) {
    updateData.logo = `/public/${req.file.filename}`;
   }
   const updatedPartners = await Partners.findByIdAndUpdate(editid, { $set: updateData }, { new: true }).lean().exec();

   if (!updatedPartners) {
    return res.status(404).json({ error: 'Not found: editid' });
   }

   return res.status(200).json(updatedPartners);
  } catch (error) {
   console.error('Error updating data:', error);
   return res.status(500).json({ error: error.message });
  }
 }
);

router.delete('/partners/:deleteid', checkUser, checkPermissions('delete_partnyorlar'), async (req, res) => {
 try {
  const { deleteid } = req.params;
  const deleteData = await Partners.findByIdAndDelete(deleteid);

  if (!deleteData) {
   return res.status(404).json({ message: 'dont delete data or not found data or another error' });
  }

  return res.status(200).json({ message: 'successfully deleted data' });
 } catch (error) {}
});

router.put('/partners/status/:id', async (req, res) => {
 try {
  const { id } = req.params;
  const { statusActive } = req.body;

  if (typeof statusActive !== 'boolean') {
   return res.status(400).json({ error: 'Status must be a boolean value' });
  }

  const updatedPurch = await Partners.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true })
   .lean()
   .exec();

  if (!updatedPurch) {
   return res.status(404).json({ error: ' not found' });
  }

  return res.status(200).json(updatedPurch);
 } catch (error) {
  console.error('Error updating status:', error);
  return res.status(500).json({ error: error.message });
 }
});

// for front
router.get('/partnersfront', async (req, res) => {
 try {
  const acceptLanguage = req.headers['accept-language'];
  const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

  const datas = await Partners.find({ statusActive: true });
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }

  const filteredData = datas.map((data) => ({
   title: data.title[preferredLanguage],
   logo: data.logo,
  }));

  return res.status(200).json(filteredData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});
module.exports = router;
