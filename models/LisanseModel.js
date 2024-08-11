const mongoose = require("mongoose");

const LisanseSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: { type: String },
});

const LisanseModel = mongoose.model("lisansemodel", LisanseSchema);

module.exports = LisanseModel;