const mongoose = require('mongoose');

const ServicesPageSchema = mongoose.Schema({
 title: {
  az: { type: String, required: false, default: '' },
  en: { type: String, required: false, default: '' },
  ru: { type: String, required: false, default: '' },
 },
 slogan: {
  az: { type: String, required: false, default: '' },
  en: { type: String, required: false, default: '' },
  ru: { type: String, required: false, default: '' },
 },
 description: {
  az: { type: String, required: false, default: '' },
  en: { type: String, required: false, default: '' },
  ru: { type: String, required: false, default: '' },
 },
 image: { type: String, required: false, default: '' },
 statusActive: {
  type: Boolean,
  default: true,
  required: false,
 },
});

const ServicesPageModel = mongoose.model('servicespagemodel', ServicesPageSchema);

module.exports = ServicesPageModel;
