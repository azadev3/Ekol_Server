const mongoose = require("mongoose");

const PageSchema = mongoose.Schema({
  path: { type: String, required: true, default: "" },
  dropdown_name: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
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
  status: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const PageModel = mongoose.model("page", PageSchema);

module.exports = PageModel;
