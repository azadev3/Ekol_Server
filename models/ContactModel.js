const mongoose = require("mongoose");

const SimpleFieldSchema = new mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  value: { type: String, required: true },
  logo: { type: String },
});

const ContactSchema = new mongoose.Schema({
  map: { type: String, required: true },
  telephones: [SimpleFieldSchema],
  faks: SimpleFieldSchema,
  location: SimpleFieldSchema,
  email: SimpleFieldSchema,
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
   },
});

const ContactModel = mongoose.model("ContactModel", ContactSchema);

module.exports = ContactModel;
