const mongoose = require("mongoose");

const LogoSchema = mongoose.Schema({
  logo: { type: String, required: true },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
   },
});

const LogoModel = mongoose.model("logomodel", LogoSchema);

module.exports = LogoModel;