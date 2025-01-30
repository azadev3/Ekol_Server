const express = require('express');
const router = express.Router();
const upload = require('../config/MulterConfig');
const DynamicCategoryContentModel = require('../models/DynamicCategoryContentModel');
const checkUser = require('../middlewares/checkUser');
const checkPermissions = require('../middlewares/checkPermissions');

router.post(
  '/dynamic-category-content',
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

      const createData = new DynamicCategoryContentModel({
        title: {
          az: req.body.title_az,
          en: req.body.title_en,
          ru: req.body.title_ru,
        },
        pdf: {
          az: pdfAzPath,
          en: pdfEnPath,
          ru: pdfRuPath,
        },
        selected_category: req.body.selected_category,
      });

      const savedData = await createData.save();

      return res.status(200).json(savedData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

router.get('/dynamic-category-content', async (req, res) => {
  try {
    const datas = await DynamicCategoryContentModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/dynamic-category-content/:editid', async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await DynamicCategoryContentModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: 'not found editid' });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/dynamic-category-content/:editid", upload.single("pdf"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru } = req.body;

//     const updatedQuarterlyDynamicCategoryContentModel = await DynamicCategoryContentModel.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           title: {
//             az: title_az,
//             en: title_en,
//             ru: title_ru,
//           },
//           pdf: req.file ? `/public/${req.file.filename}` : "",
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedQuarterlyDynamicCategoryContentModel) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedQuarterlyDynamicCategoryContentModel);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put(
    '/dynamic-category-content/:editid',
    upload.fields([
      { name: 'pdfaz', maxCount: 1 },
      { name: 'pdfen', maxCount: 1 },
      { name: 'pdfru', maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const { editid } = req.params;
        const { title_az, title_en, title_ru, selected_category } = req.body;
  
        const existingData = await DynamicCategoryContentModel.findById(editid).exec();
        if (!existingData) {
          return res.status(404).json({ error: 'Not found: editid' });
        }
  
        const pdfAzPath = req.files['pdfaz'] ? `/public/${req.files['pdfaz'][0].filename}` : existingData.pdf.az;
        const pdfEnPath = req.files['pdfen'] ? `/public/${req.files['pdfen'][0].filename}` : existingData.pdf.en;
        const pdfRuPath = req.files['pdfru'] ? `/public/${req.files['pdfru'][0].filename}` : existingData.pdf.ru;
  
        const updateData = {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          pdf: {
            az: pdfAzPath,
            en: pdfEnPath,
            ru: pdfRuPath,
          },
          selected_category: selected_category,
        };
  
        const updatedQuarterlyDynamicCategoryContentModel = await DynamicCategoryContentModel.findByIdAndUpdate(
          editid,
          { $set: updateData },
          { new: true },
        )
          .lean()
          .exec();
  
        if (!updatedQuarterlyDynamicCategoryContentModel) {
          return res.status(404).json({ error: 'Not found: editid' });
        }
  
        return res.status(200).json(updatedQuarterlyDynamicCategoryContentModel);
      } catch (error) {
        console.error('Error updating data:', error);
        return res.status(500).json({ error: error.message });
      }
    },
  );
  

router.delete('/dynamic-category-content/:deleteid', async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await DynamicCategoryContentModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: 'dont delete data or not found data or another error' });
    }

    return res.status(200).json({ message: 'successfully deleted data' });
  } catch (error) {}
});

// for front
router.get('/dynamic-category-content-front', async (req, res) => {
  try {
    const acceptLanguage = req.headers['accept-language'];
    const preferredLanguage = acceptLanguage.split(',')[0].split(';')[0];

    const datas = await DynamicCategoryContentModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      pdf: data.pdf[preferredLanguage],
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
