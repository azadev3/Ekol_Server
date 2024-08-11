const mongoose = require("mongoose");

const PartnersSchema = mongoose.Schema({
  title: {
    az: String,
    en: String,
    ru: String,
  },
  logo: { type: String, required: true },
});

const PartnersModel = mongoose.model("partnersmodel", PartnersSchema);

module.exports = PartnersModel;
