const mongoose = require("mongoose");

const ToolsInnerModelSchema = mongoose.Schema({
  title: {
    az: String,
    en: String,
    ru: String,
  },
  description: {
    az: String,
    en: String,
    ru: String,
  },
  image: {
    type: String,
    required: false,
  },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
   },
});

const ToolsInnerModel = mongoose.model("tool", ToolsInnerModelSchema);

module.exports = ToolsInnerModel;
