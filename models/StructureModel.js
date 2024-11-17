const mongoose = require("mongoose");

const StructureSchema = mongoose.Schema({
  image: {
    type: String,
    required: false,
    default: "",
  },
});

const StructureModel = mongoose.model("structure_img", StructureSchema);

module.exports = StructureModel;
