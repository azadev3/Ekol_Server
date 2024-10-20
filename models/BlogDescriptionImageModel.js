const mongoose = require("mongoose");

const BlogDescriptionImageSchema = mongoose.Schema({
  images: { type: [String], required: true },
  selected_blog: { type: String, required: true },
});

const BlogDescriptionImageModel = mongoose.model("blogimage", BlogDescriptionImageSchema);

module.exports = BlogDescriptionImageModel;