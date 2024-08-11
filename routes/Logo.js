const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Logo = require("../models/LogoModel");

router.post("/logo", upload.single("imgback"), async (req, res) => {
  try {
    const imageFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new Logo({
      logo: imageFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/logo", async (req, res) => {
  try {
    const datas = await Logo.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/logo/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Logo.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/logo/:editid", upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const updatedLogo = await Logo.findByIdAndUpdate(
      editid,
      {
        $set: {
          logo: req.file ? `/public/${req.file.filename}` : "",
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedLogo) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedLogo);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/logo/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Logo.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front

router.get("/logofront", async (req, res) => {
  try {
    const datas = await Logo.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
