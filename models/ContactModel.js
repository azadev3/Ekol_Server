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
  telephones: [SimpleFieldSchema],
  faks: SimpleFieldSchema,
  location: SimpleFieldSchema,
  email: SimpleFieldSchema,
});

const ContactModel = mongoose.model("ContactModel", ContactSchema);

module.exports = ContactModel;
