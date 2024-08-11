const mongoose = require("mongoose");

const OurWorksInnerSchema = mongoose.Schema({
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
});

const OurWorksInnerModel = mongoose.model("ourworksinnermodel", OurWorksInnerSchema);

module.exports = OurWorksInnerModel;