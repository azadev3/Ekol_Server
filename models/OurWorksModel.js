const mongoose = require("mongoose");

const OurWorksSchema = mongoose.Schema({
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
    required: false,
  },
});

const OurWorksModel = mongoose.model("ourworks", OurWorksSchema);

module.exports = OurWorksModel;
