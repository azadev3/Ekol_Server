const mongoose = require("mongoose");

const CareerOpportunitiesBackgroundSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  backgroundImage: { type: String, required: true },
});

const CareerOpportunitiesBackgroundModel = mongoose.model(
  "careeropportunitiesbackgroundmodel",
  CareerOpportunitiesBackgroundSchema
);

module.exports = CareerOpportunitiesBackgroundModel;