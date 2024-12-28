const mongoose = require('mongoose');

const YearlyCalculationsSchema = mongoose.Schema(
  {
    title: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    pdf: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const YearlyCalculationsModel = mongoose.model('yearly_calculation', YearlyCalculationsSchema);

module.exports = YearlyCalculationsModel;
