const mongoose = require("mongoose");

const PurchaseCountriesModelSchema = mongoose.Schema({
  countries: [{ type: String, required: true }],
});

const PurchaseCountriesModel = mongoose.model("purchase_countries", PurchaseCountriesModelSchema);

module.exports = PurchaseCountriesModel;
