const mongoose = require("mongoose");

const EquipmentSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
});

const EquipmentModel = mongoose.model("equipment", EquipmentSchema);

module.exports = EquipmentModel;