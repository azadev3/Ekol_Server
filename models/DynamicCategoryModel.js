const mongoose = require('mongoose');

const CategoryInnerSchema = mongoose.Schema({
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
});

const DynamicCategoryModelSchema = mongoose.Schema({
  category_title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  product: [CategoryInnerSchema],
});

const DynamicCategoryModel = mongoose.model('calculation_dynamic_category', DynamicCategoryModelSchema);

module.exports = DynamicCategoryModel;