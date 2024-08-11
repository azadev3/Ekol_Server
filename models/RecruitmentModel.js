const mongoose = require("mongoose");

const RecruitmentSchema = mongoose.Schema({
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
  order: { type: String, required: true },
});

const RecruitmentModel = mongoose.model("recruitmentmodel", RecruitmentSchema);

module.exports = RecruitmentModel;
