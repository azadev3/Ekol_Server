const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const Socials = require('../models/SocialModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post('/socials', checkUser, checkPermissions('create_socials'), upload.single('imgback'), async (req, res) => {
 try {
  const { link } = req.body;

  if (!link) {
   return res.status(400).json({ message: 'missing field link' });
  }
  const imageFile = req.file ? `/public/${req.file.filename}` : '';

  const createData = new Socials({
   link: link,
   icon: imageFile,
   statusActive: req.body.statusActive || true,
  });

  const savedData = await createData.save();

  return res.status(200).json(savedData);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.get('/socials', checkUser, checkPermissions('list_socials'), async (req, res) => {
 try {
  const datas = await Socials.find();
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }
  return res.status(200).json(datas);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});

router.get('/socials/:editid', async (req, res) => {
 try {
  const { editid } = req.params;

  const datasForId = await Socials.findById(editid).lean().exec();

  if (!datasForId) {
   return res.status(404).json({ error: 'not found editid' });
  }

  return res.status(200).json(datasForId);
 } catch (error) {
  console.error('Error fetching data:', error);
  return res.status(500).json({ error: error.message });
 }
});

// router.put("/socials/:editid", upload.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { link } = req.body;

//     const updatedSocials = await Socials.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           link: link,
//           icon: req.file ? `/public/${req.file.filename}` : "",
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedSocials) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedSocials);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put(
 '/socials/:editid',
 checkUser,
 checkPermissions('update_socials'),
 upload.single('imgback'),
 async (req, res) => {
  try {
   const { editid } = req.params;
   const { link } = req.body;

   const existingSocials = await Socials.findById(editid).exec();
   if (!existingSocials) {
    return res.status(404).json({ error: 'Social not found' });
   }

   const updatedData = {};

   if (link) {
    updatedData.link = link;
   } else {
    updatedData.link = existingSocials.link;
   }

   if (req.file) {
    updatedData.icon = `/public/${req.file.filename}`;
   } else {
    updatedData.icon = existingSocials.icon;
   }

   if (Object.keys(updatedData).length === 0) {
    return res.status(200).json(existingSocials);
   }

   const updatedSocial = await Socials.findByIdAndUpdate(editid, { $set: updatedData }, { new: true }).lean().exec();

   return res.status(200).json(updatedSocial);
  } catch (error) {
   console.error('Error updating data:', error);
   return res.status(500).json({ error: error.message });
  }
 }
);

router.delete('/socials/:deleteid', checkUser, checkPermissions('delete_socials'), async (req, res) => {
 try {
  const { deleteid } = req.params;
  const deleteData = await Socials.findByIdAndDelete(deleteid);

  if (!deleteData) {
   return res.status(404).json({ message: 'dont delete data or not found data or another error' });
  }

  return res.status(200).json({ message: 'successfully deleted data' });
 } catch (error) {}
});

router.put('/socials/status/:id', async (req, res) => {
 try {
  const { id } = req.params;
  const { statusActive } = req.body;

  if (typeof statusActive !== 'boolean') {
   return res.status(400).json({ error: 'Status must be a boolean value' });
  }

  const updatedPurch = await Socials.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

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
router.get('/socialsfront', async (req, res) => {
 try {
  const datas = await Socials.find({ statusActive: true });
  if (!datas || datas.length === 0) {
   return res.status(404).json({ message: 'No data found' });
  }
  return res.status(200).json(datas);
 } catch (error) {
  return res.status(500).json({ error: error.message });
 }
});
module.exports = router;
