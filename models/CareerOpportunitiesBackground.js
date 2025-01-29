const mongoose = require('mongoose');

const CareerOpportunitiesBackgroundSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  backgroundImage: { type: String, required: true },
});

const CareerOpportunitiesBackgroundModel = mongoose.model('careeropportunitiesbackgroundmodel', CareerOpportunitiesBackgroundSchema);

module.exports = CareerOpportunitiesBackgroundModel;
