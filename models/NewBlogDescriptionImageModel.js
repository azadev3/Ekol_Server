const mongoose = require("mongoose");

const NewBlogDescriptionImageSchema = mongoose.Schema({
  images: { type: [String], required: true },
  selected_blog: { type: String, required: true },
});

const NewBlogDescriptionImageModel = mongoose.model("newblogimage", NewBlogDescriptionImageSchema);

module.exports = NewBlogDescriptionImageModel;