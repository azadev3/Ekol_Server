const mongoose = require("mongoose");

const WhyEcolSchema = mongoose.Schema({
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
  icon: { type: String, required: true },
});

const WhyEcolModel = mongoose.model("whyecolmodel", WhyEcolSchema);

module.exports = WhyEcolModel;
