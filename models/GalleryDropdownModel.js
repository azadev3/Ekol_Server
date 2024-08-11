const mongoose = require("mongoose");

const GalleryDropdownSchema = mongoose.Schema({
  title: {
    az: { type: String, require: true },
    en: { type: String, require: true },
    ru: { type: String, require: true },
  },
  backgroundImage: { type: String, require: true },
});

const GalleryDropdownModel = mongoose.model("gallerydropdown", GalleryDropdownSchema);

module.exports = GalleryDropdownModel;
