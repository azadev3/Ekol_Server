const mongoose = require("mongoose");

const HeroSchema = mongoose.Schema({
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

const HeroModel = mongoose.model("heromodel", HeroSchema);

module.exports = HeroModel;
