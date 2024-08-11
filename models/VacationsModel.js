const mongoose = require("mongoose");

const VacationSchema = mongoose.Schema({
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
  location: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  workRegime: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  endDate: { type: String, required: true },
  startDate: { type: String, required: true },
});

const VacationModel = mongoose.model("vacationsmodel", VacationSchema);

module.exports = VacationModel;
