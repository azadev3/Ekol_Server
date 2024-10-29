const mongoose = require("mongoose");

const EquipmentInnerDescriptionSchema = mongoose.Schema({
  image: {
    type: String,
    required: false,
    default: "",
  },
  selected_eq: { type: String, required: true },
});

const EquipmentInnerDescription = mongoose.model("eq_inner_description", EquipmentInnerDescriptionSchema);

module.exports = EquipmentInnerDescription;
