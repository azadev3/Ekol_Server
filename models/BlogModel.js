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
  created_at_string: { type: String, required: false, default: "" },
  created_at: { type: Date, default: Date.now }, 
  updated: { type: String, required: false, default: "" },
});

const BlogModel = mongoose.model("blogmodel", BlogSchema);

module.exports = BlogModel;
