const express = require("express");
const upload = require("../config/MulterConfig");
const router = express.Router();
const ApplyVacation = require("../models/ApplyVacationModel");

router.post(
  "/applyvacation",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userProfile = req.files["profile"] ? `/public/${req.files["profile"][0].filename}` : "";
      const cv = req.files["cv"] ? `/public/${req.files["cv"][0].filename}` : "";

      const requiredFields = ["email", "name", "surname", "telephone", "apply_vacation_name", "applyDate"];
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
      return res.status(200).json({ savedUserData: savedData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/applyvacation", async (req, res) => {
  try {
    const datas = await ApplyVacation.find().lean().exec();
    if (!datas) {
      return res.status(404).json({ message: "datas is null" });
    }

    return res.status(200).json({ data: datas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/applyvacation/:apply_id", async (req, res) => {
  try {
    const { apply_id } = req.params;

    const removeApply = await ApplyVacation.findByIdAndDelete(apply_id);

    if (!removeApply) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
