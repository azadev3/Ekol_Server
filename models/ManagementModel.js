const mongoose = require("mongoose");

const ManagementSchema = mongoose.Schema({
  nameSurname: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  job: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  profile: { type: String, required: true },
  description: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  education: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
});

const ManagementModel = mongoose.model("managementmodel", ManagementSchema);

module.exports = ManagementModel;
