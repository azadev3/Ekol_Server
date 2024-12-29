const mongoose = require('mongoose');

const VacationSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  description: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  location: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  workRegime: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  endDate: { type: String, required: false, default: '' },
  startDate: { type: String, required: false, default: '' },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const VacationModel = mongoose.model('vacationsmodel', VacationSchema);

module.exports = VacationModel;
