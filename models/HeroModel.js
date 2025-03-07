const mongoose = require('mongoose');

const HeroSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  description: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  image: {
    type: String,
    required: false,
    default: '',
  },
  mobileImage: {
    type: String,
    required: false,
    default: '',
  },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const HeroModel = mongoose.model('heromodel', HeroSchema);

module.exports = HeroModel;
