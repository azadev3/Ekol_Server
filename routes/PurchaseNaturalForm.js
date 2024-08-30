const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const PurchaseNaturalForm = require("../models/PurchaseNaturalFormModel");

router.post("/purchaseNaturalForm", upload.single("requestpdf"), async (req, res) => {
     try {
       const requiredFields = [
         "voen", "name", "surname", "mobtel", "email", "location",
         "enterprisename", "enterpriseNameOrTel", "enterprisepart",
         "typeofrequest", "message", "country"
       ];
   
       for (let field of requiredFields) {
         if (!req.body[field]) {
           return res.status(400).json({ error: `Missing field: ${field}` });
         }
       }
   
       const pdfFile = req.file ? `/public/${req.file.filename}` : "";
   
       const savedData = new PurchaseNaturalForm({
         voen: req.body.voen,
         name: req.body.name,
         surname: req.body.surname,
         mobtel: req.body.mobtel,
         email: req.body.email,
         location: req.body.location,
         enterprisename: req.body.enterprisename,
         enterpriseNameOrTel: req.body.enterpriseNameOrTel,
         enterprisepart: req.body.enterprisepart,
         typeofrequest: req.body.typeofrequest,
         message: req.body.message,
         requestpdf: pdfFile,
         country: req.body.country,
       });
   
       const save = await savedData.save();
       return res.status(200).json(save);
     } catch (error) {
       return res.status(500).json({ error: error.message });
     }
   });
   
   router.delete("/deleteItemNat/:id", async (req, res) => {
     try {
       const id = req.params.id;
       const findDataById = await PurchaseNaturalForm.findByIdAndDelete(id);
       if (!findDataById) {
         return res.status(404).json({ message: "Item not found" });
       }
       return res.status(200).json({ message: "Item deleted successfully!" });
     } catch (error) {
       return res.status(500).json({ error: error.message });
     }
   });
   

// for front
router.get("/purchaseNaturalFormFront", async (req, res) => {
  try {
    const datas = await PurchaseNaturalForm.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
