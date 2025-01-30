const mongoose = require('mongoose');

const DynamicCategoryContentSchema = mongoose.Schema({
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  pdf: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
  selected_category: { type: String, required: true },
});

const DynamicCategoryContentModel = mongoose.model('dynamic_calc_content', DynamicCategoryContentSchema);

module.exports = DynamicCategoryContentModel;
