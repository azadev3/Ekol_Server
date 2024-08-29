const mongoose = require("mongoose");

const PurchaseAnnouncementSchema = mongoose.Schema(
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
    predmet: {
      az: { type: String, required: true },
      en: { type: String, required: true },
      ru: { type: String, required: true },
    },
    pdf: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const PurchaseAnnouncementModel = mongoose.model("purchase_announcement", PurchaseAnnouncementSchema);

module.exports = PurchaseAnnouncementModel;
