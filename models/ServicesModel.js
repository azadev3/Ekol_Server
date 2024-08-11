const mongoose = require("mongoose");

const ServicesSchema = mongoose.Schema({
  title: {
    az: String,
    en: String,
    ru: String,
  },
  description: {
    az: String,
    en: String,
    ru: String,
  },
  image: {
    type: String,
    required: true,
  },
});

const ServicesModel = mongoose.model("servicesmodel", ServicesSchema);

module.exports = ServicesModel;
