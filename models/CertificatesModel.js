const mongoose = require("mongoose");

const CertificateSchema = mongoose.Schema({
  title: {
    az: String,
    en: String,
    ru: String,
  },
  description: {
    az: String,
    en: String,
    ru: String,
  },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
   },
});

const CertificatesModel = mongoose.model("certificate", CertificateSchema);

module.exports = CertificatesModel;
