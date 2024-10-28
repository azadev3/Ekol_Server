const mongoose = require("mongoose");

const StructureCategoriesSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: "" },
    en: { type: String, required: false, default: "" },
    ru: { type: String, required: false, default: "" },
  },
});

const StructureCategoriesModel = mongoose.model("structure_category", StructureCategoriesSchema);

module.exports = StructureCategoriesModel;
