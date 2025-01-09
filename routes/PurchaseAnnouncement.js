const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const PurchaseAnnouncement = require('../models/PurchaseAnnouncementModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post(
  '/purchaseannouncement',
  checkUser,
  checkPermissions('create_satinalma_elanlari'),
  upload.fields([
    { name: 'pdfaz', maxCount: 1 },
    { name: 'pdfen', maxCount: 1 },
    { name: 'pdfru', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const pdfAzPath = req.files['pdfaz'] ? `/public/${req.files['pdfaz'][0].filename}` : '';
      const pdfEnPath = req.files['pdfen'] ? `/public/${req.files['pdfen'][0].filename}` : '';
      const pdfRuPath = req.files['pdfru'] ? `/public/${req.files['pdfru'][0].filename}` : '';

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
        pdf: {
          az: pdfAzPath,
          en: pdfEnPath,
          ru: pdfRuPath,
        },
        end_date: req.body.end_date,
        status: req.body?.status,
        statusActive: req.body.statusActive || true,
      });

      const savedData = await createData.save();

      return res.status(200).json(savedData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

router.get('/purchaseannouncement', checkUser, checkPermissions('list_satinalma_elanlari'), async (req, res) => {
  try {
    const datas = await PurchaseAnnouncement.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/purchaseannouncement/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await PurchaseAnnouncement.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/purchaseannouncement/:editid", upload.single("pdf"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const {
//       title_az,
//       title_en,
//       title_ru,
//       description_az,
//       description_en,
//       description_ru,
//       predmet_az,
//       predmet_en,
//       predmet_ru,
//       end_date,
//       status,
//     } = req.body;

//     const updatedPurchase = await PurchaseAnnouncement.findByIdAndUpdate(
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
//           predmet: {
//             az: predmet_az,
//             en: predmet_en,
//             ru: predmet_ru,
//           },
//           end_date: end_date,
//           status: status,
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

router.put(
  '/purchaseannouncement/:editid',
  checkUser,
  checkPermissions('update_satinalma_elanlari'),
  upload.fields([
    { name: 'pdfaz', maxCount: 1 },
    { name: 'pdfen', maxCount: 1 },
    { name: 'pdfru', maxCount: 1 },
  ]),
  async (req, res) => {
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

      // Find the existing announcement by ID
      const existingAnnouncement = await PurchaseAnnouncement.findById(editid).exec();
      if (!existingAnnouncement) {
        return res.status(404).json({ error: 'PurchaseAnnouncement not found' });
      }

      const updatedData = {};

      // Update title if provided
      if (title_az || title_en || title_ru) {
        updatedData.title = {
          az: title_az || existingAnnouncement.title.az,
          en: title_en || existingAnnouncement.title.en,
          ru: title_ru || existingAnnouncement.title.ru,
        };
      }

      // Update description if provided
      if (description_az || description_en || description_ru) {
        updatedData.description = {
          az: description_az || existingAnnouncement.description.az,
          en: description_en || existingAnnouncement.description.en,
          ru: description_ru || existingAnnouncement.description.ru,
        };
      }

      // Update predmet if provided
      if (predmet_az || predmet_en || predmet_ru) {
        updatedData.predmet = {
          az: predmet_az || existingAnnouncement.predmet.az,
          en: predmet_en || existingAnnouncement.predmet.en,
          ru: predmet_ru || existingAnnouncement.predmet.ru,
        };
      }

      // Update end_date if provided
      if (end_date) {
        updatedData.end_date = end_date || existingAnnouncement.end_date;
      }

      // Update status if provided
      if (status) {
        updatedData.status = status || existingAnnouncement.status;
      }

      // Handle PDF updates
      if (req.files) {
        // Check and update each language's PDF if a new file is uploaded
        if (req.files['pdfaz']) {
          updatedData.pdf = updatedData.pdf || {};
          updatedData.pdf.az = `/public/${req.files['pdfaz'][0].filename}`;
        }
        if (req.files['pdfen']) {
          updatedData.pdf = updatedData.pdf || {};
          updatedData.pdf.en = `/public/${req.files['pdfen'][0].filename}`;
        }
        if (req.files['pdfru']) {
          updatedData.pdf = updatedData.pdf || {};
          updatedData.pdf.ru = `/public/${req.files['pdfru'][0].filename}`;
        }
      } else {
        // Keep the existing PDF paths if no new files are uploaded
        updatedData.pdf = existingAnnouncement.pdf;
      }

      // If there are no changes to update, return the existing data
      if (Object.keys(updatedData).length === 0) {
        return res.status(200).json(existingAnnouncement);
      }

      // Update the announcement in the database
      const updatedPurchaseAnnouncement = await PurchaseAnnouncement.findByIdAndUpdate(editid, { $set: updatedData }, { new: true })
        .lean()
        .exec();

      return res.status(200).json(updatedPurchaseAnnouncement);
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.put('/purch/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActive } = req.body;

    if (typeof statusActive !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean value' });
    }

    const updatedPurch = await PurchaseAnnouncement.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

    if (!updatedPurch) {
      return res.status(404).json({ error: 'PurchaseAnnouncement not found' });
    }

    return res.status(200).json(updatedPurch);
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/purchaseannouncement/:deleteid', checkUser, checkPermissions('delete_satinalma_elanlari'), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await PurchaseAnnouncement.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// for front
router.get('/purchaseannouncementfront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await PurchaseAnnouncement.find({ statusActive: true });
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      predmet: data.predmet[preferredLanguage],
      createdAt: data.createdAt,
      end_date: data.end_date,
      pdf: data.pdf[preferredLanguage],
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
