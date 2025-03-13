const mongoose = require('mongoose');

const CalculationsSchema = mongoose.Schema(
  {
    title: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    pdf: {
      az: { type: String, required: false, default: "" },
      en: { type: String, required: false, default: "" },
      ru: { type: String, required: false, default: "" },
    },
  },
  { timestamps: true },
);

const CalculationsModel = mongoose.model('quarterly_calculation', CalculationsSchema);

module.exports = CalculationsModel;
