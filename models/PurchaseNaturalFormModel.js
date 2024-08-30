const mongoose = require("mongoose");

// Natural Form Schema
const NaturalFormSchema = mongoose.Schema({
  voen: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  mobtel: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  enterprisename: { type: String, required: true },
  enterpriseNameOrTel: { type: String, required: true },
  enterprisepart: { type: String, required: true },
  typeofrequest: { type: String, required: true },
  message: { type: String, required: true },
  requestpdf: { type: String, required: true }, // Consider storing a URL or file info
  country: { type: String, required: true },
});

const PurchaseNaturalFormModel = mongoose.model("PurchaseNaturalForm", NaturalFormSchema);

module.exports = PurchaseNaturalFormModel;
