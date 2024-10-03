const mongoose = require("mongoose");

const NewBlogSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
  description: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
  image: {
    type: String,
    required: false,
    default: "",
  },
  created_at: { type: String, required: false, default: "" },
  updated: { type: String, required: false, default: "" },
});

const NewBlogModel = mongoose.model("newblogmodel", NewBlogSchema);

module.exports = NewBlogModel;
