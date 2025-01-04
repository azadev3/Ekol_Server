const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const ProcedureModel = require('../models/ProcedureModel');

router.post(
  '/procedure',
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

      const createData = new ProcedureModel({
        pdf: {
          az: pdfAzPath,
          en: pdfEnPath,
          ru: pdfRuPath,
        },
        statusActive: req.body.statusActive || true,
      });

      const savedData = await createData.save();

      return res.status(200).json(savedData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

router.get('/procedure', async (req, res) => {
  try {
    const datas = await ProcedureModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/procedure/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await ProcedureModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/procedure/:editid", upload.single("pdf"), async (req, res) => {
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

//     const updatedPurchase = await ProcedureModel.findByIdAndUpdate(
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
  '/procedure/:editid',
  upload.fields([
    { name: 'pdfaz', maxCount: 1 },
    { name: 'pdfen', maxCount: 1 },
    { name: 'pdfru', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { editid } = req.params;

      const existingAnnouncement = await ProcedureModel.findById(editid).exec();
      if (!existingAnnouncement) {
        return res.status(404).json({ error: 'ProcedureModel not found' });
      }

      const updatedData = {};

      if (req.file) {
        updatedData.pdf.az = `/public/${req.files['pdfaz'][0].filename}`;
        updatedData.pdf.en = `/public/${req.files['pdfen'][0].filename}`;
        updatedData.pdf.ru = `/public/${req.files['pdfru'][0].filename}`;
      } else {
        updatedData.pdf.az = existingAnnouncement.pdf.az;
        updatedData.pdf.en = existingAnnouncement.pdf.en;
        updatedData.pdf.ru = existingAnnouncement.pdf.ru;
      }

      if (Object.keys(updatedData).length === 0) {
        return res.status(200).json(existingAnnouncement);
      }
      const updateProcedure = await ProcedureModel.findByIdAndUpdate(editid, { $set: updatedData }, { new: true }).lean().exec();

      return res.status(200).json(updateProcedure);
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(500).json({ error: error.message });
    }
  },
);

router.put('/procedure/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { statusActive } = req.body;

    if (typeof statusActive !== 'boolean') {
      return res.status(400).json({ error: 'Status must be a boolean value' });
    }

    const updatedPurch = await ProcedureModel.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();

    if (!updatedPurch) {
      return res.status(404).json({ error: 'ProcedureModel not found' });
    }

    return res.status(200).json(updatedPurch);
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/procedure/:deleteid', async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await ProcedureModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

// for front
router.get('/procedurefront', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];
    const datas = await ProcedureModel.find({ statusActive: true });

    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      pdf: data.pdf[preferredLanguage],
      status: data.status,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
