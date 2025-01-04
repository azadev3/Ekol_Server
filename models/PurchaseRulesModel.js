const mongoose = require('mongoose');

const PurchaseRulesSchema = mongoose.Schema(
  {
    title: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    pdf: {
      az: { type: String, required: false, default: '' },
      en: { type: String, required: false, default: '' },
      ru: { type: String, required: false, default: '' },
    },
  },
  { timestamps: true },
);

const PurchaseRulesModel = mongoose.model('purchase_rules', PurchaseRulesSchema);

module.exports = PurchaseRulesModel;
