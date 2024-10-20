const mongoose = require("mongoose");

const OurWorksImageSchema = mongoose.Schema({
  images: { type: [String], required: true },
  selected_ourworks: { type: String, required: true },
});

const OurWorksImageModel = mongoose.model("ourworksimage", OurWorksImageSchema);

module.exports = OurWorksImageModel;