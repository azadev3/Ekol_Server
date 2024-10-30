const mongoose = require("mongoose");

const ToolsInnerImagesModelSchema = mongoose.Schema({
  images: { type: [String], required: true },
  selected_tools: { type: String, required: true },
});

const ToolsInnerImagesModel = mongoose.model("toolsinnerimage", ToolsInnerImagesModelSchema);

module.exports = ToolsInnerImagesModel;