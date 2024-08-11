const mongoose = require("mongoose");

const LogoSchema = mongoose.Schema({
  logo: { type: String, required: true },
});

const LogoModel = mongoose.model("logomodel", LogoSchema);

module.exports = LogoModel;