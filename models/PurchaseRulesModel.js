const mongoose = require("mongoose");

const PurchaseRulesSchema = mongoose.Schema(
  {
    title: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    pdf: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PurchaseRulesModel = mongoose.model("purchase_rules", PurchaseRulesSchema);

module.exports = PurchaseRulesModel;
