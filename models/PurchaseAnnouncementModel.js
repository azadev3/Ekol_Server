const mongoose = require("mongoose");

const PurchaseAnnouncementSchema = mongoose.Schema(
  {
    title: {
      az: { type: String, required: false, default: "" },
      en: { type: String, required: false, default: "" },
      ru: { type: String, required: false, default: "" },
    },
    description: {
      az: { type: String, required: false, default: "" },
      en: { type: String, required: false, default: "" },
      ru: { type: String, required: false, default: "" },
    },
    predmet: {
      az: { type: String, required: false, default: "" },
      en: { type: String, required: false, default: "" },
      ru: { type: String, required: false, default: "" },
    },
    pdf: {
      type: String,
      required: false,
      default: "",
    },
    end_date: {
      type: String,
      required: false,
      default: "",
    },
    status: {
      type: String,
    },
    statusActive: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  { timestamps: true }
);

const PurchaseAnnouncementModel = mongoose.model("purchase_announcement", PurchaseAnnouncementSchema);

module.exports = PurchaseAnnouncementModel;
