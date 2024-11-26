const mongoose = require("mongoose");

const PageSchema = mongoose.Schema({
  path: { type: String, required: true, default: "" },
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
});

const PageModel = mongoose.model("page", PageSchema);

module.exports = PageModel;
