const mongoose = require("mongoose");

const ServicesPageSchema = mongoose.Schema({
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
  image: { type: String, required: true },
});

const ServicesPageModel = mongoose.model("servicespagemodel", ServicesPageSchema);

module.exports = ServicesPageModel;
