const mongoose = require('mongoose');

const DynamicCategoryContentSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  pdf: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  selected_category: { type: String, required: true },
});

const DynamicCategoryContentModel = mongoose.model('dynamic_calc_content', DynamicCategoryContentSchema);

module.exports = DynamicCategoryContentModel;
