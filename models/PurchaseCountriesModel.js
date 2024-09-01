const mongoose = require("mongoose");

const CountriesPurchase = mongoose.Schema({
  country: { type: String, required: true },
});

const PurchaseCountriesModelSchema = mongoose.Schema({
  countries: [CountriesPurchase],
});

const PurchaseCountriesModel = mongoose.model("purchase_countries", PurchaseCountriesModelSchema);

module.exports = PurchaseCountriesModel;
