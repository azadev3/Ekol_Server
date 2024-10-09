const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
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
  created_at: { type: Date, default: Date.now }, 
  updated: { type: Date, default: Date.now }, 
});

const BlogModel = mongoose.model("blogmodel", BlogSchema);

module.exports = BlogModel;
