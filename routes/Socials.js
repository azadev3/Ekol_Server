const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Socials = require("../models/SocialModel");

router.post("/socials", upload.single("imgback"), async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({ message: "missing field link" });
    }
    const imageFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new Socials({
      link: link,
      icon: imageFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/socials", async (req, res) => {
  try {
    const datas = await Socials.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/socials/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Socials.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/socials/:editid", upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { link } = req.body;

    const updatedSocials = await Socials.findByIdAndUpdate(
      editid,
      {
        $set: {
          link: link,
          icon: req.file ? `/public/${req.file.filename}` : "",
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedSocials) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedSocials);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/socials/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Socials.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front

router.get("/socialsfront", async (req, res) => {
  try {
    const datas = await Socials.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
