const mongoose = require('mongoose');

const MetaKaryeraVakansiyalarSchema = mongoose.Schema({
  meta_title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  meta_description: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  meta_author: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  meta_generator: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
});

const MetaKaryeraVakansiyalarModel = mongoose.model('meta_tags_karyeraimkanlarivakansiyalar', MetaKaryeraVakansiyalarSchema);

module.exports = MetaKaryeraVakansiyalarModel;
