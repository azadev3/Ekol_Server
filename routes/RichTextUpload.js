const express = require("express");
const router = express.Router();
const uploadRichText = require("../config/MulterConfigRichText");
const RichTextUpload = require("../models/RichTextUploadModel");

router.post("/uploadForEditor", uploadRichText.single("richImg"), async (req, res) => {
  try {
    const imgfile = req.file ? `/richtextuploads/${req.file.filename}` : "";

    const saveData = new RichTextUpload({
      url: imgfile,
    });

    const savedData = await saveData.save();

    return res.status(200).json({ data: savedData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/getImageUrl", uploadRichText.none(), async (req, res) => {
  try {
    const sendData = await RichTextUpload.find();

    return res.status(200).json({ data: sendData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
