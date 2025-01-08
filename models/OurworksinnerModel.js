const mongoose = require("mongoose");

const OurWorksInnerSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  description: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
   },
});

const OurWorksInnerModel = mongoose.model("ourworksinnermodel", OurWorksInnerSchema);

module.exports = OurWorksInnerModel;