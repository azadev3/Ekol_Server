const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const CategorySchema = new mongoose.Schema({
  categoryName: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  categoryImg: {
    type: String,
    required: true,
  },
  images: [ImageSchema], 
});

const ImagesModel = mongoose.model("galleryimagepagemodel", CategorySchema);

module.exports = ImagesModel;
