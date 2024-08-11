const mongoose = require("mongoose");

const PurchaseModelSchema = mongoose.Schema(
  {
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
    pdf: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PurchaseModel = mongoose.model("purchase", PurchaseModelSchema);

module.exports = PurchaseModel;
