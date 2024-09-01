const express = require("express");
const router = express.Router();
const PurchaseCountriesModel = require("../models/PurchaseCountriesModel");

router.post("/purchaseAddCountry", async (req, res) => {
  try {
    const { countries } = req.body;

    // Check if countries is an array and not empty
    if (!Array.isArray(countries) || countries.length === 0) {
      return res.status(400).json({ message: "Countries is not found or empty" });
    }

    // Retrieve the current document, if any
    const existingDocument = await PurchaseCountriesModel.findOne();

    if (existingDocument) {
      // If document exists, update countries array
      existingDocument.countries = [...existingDocument.countries, ...countries];

      // Remove duplicates if necessary
      existingDocument.countries = Array.from(
        new Set(existingDocument.countries.map((country) => country.country))
      ).map((country) => ({ country }));

      const updatedData = await existingDocument.save();
      return res.status(200).json({ savedData: updatedData });
    } else {
      // If no document exists, create a new one
      const newDocument = new PurchaseCountriesModel({ countries });
      const savedData = await newDocument.save();
      return res.status(200).json({ savedData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/purchaseCountries", async (req, res) => {
  try {
    const purchaseCountry = await PurchaseCountriesModel.find().lean().exec();

    return res.status(200).send(purchaseCountry);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
