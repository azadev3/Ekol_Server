const mongoose = require("mongoose");

const LisansePageModelSchema = mongoose.Schema({
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
});

const LisansePageModel = mongoose.model("lisansepagemodel", LisansePageModelSchema);

module.exports = LisansePageModel;
