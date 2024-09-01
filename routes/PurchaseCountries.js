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

    // Save the countries to the database
    const addModelTheCountries = new PurchaseCountriesModel({ countries });

    const savedData = await addModelTheCountries.save();

    return res.status(200).json({ savedData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
