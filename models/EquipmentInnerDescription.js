const mongoose = require("mongoose");

const EquipmentInnerDescriptionSchema = mongoose.Schema({
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  images: { type: [String], required: true },
});

const EquipmentInnerDescription = mongoose.model("eq_inner_description", EquipmentInnerDescriptionSchema);

module.exports = EquipmentInnerDescription;
