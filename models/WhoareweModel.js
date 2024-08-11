const mongoose = require("mongoose");

const WhoAreWeSchema = mongoose.Schema({
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

const WhoAreWeModel = mongoose.model("whoarewemodel", WhoAreWeSchema);

module.exports = WhoAreWeModel;
