const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  mapUrl: { type: String, required: true },
});

const LocationModel = mongoose.model("locationmodel", LocationSchema);

module.exports = LocationModel;
