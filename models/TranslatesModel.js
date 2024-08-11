const mongoose = require("mongoose");

const TranslateSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  az: { type: String, required: true },
  en: { type: String, required: true },
  ru: { type: String, required: true },
});

const TranslateModel = mongoose.model("translatemodel", TranslateSchema);

module.exports = TranslateModel;
