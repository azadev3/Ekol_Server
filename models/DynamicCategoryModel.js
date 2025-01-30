const mongoose = require('mongoose');

const DynamicCategoryModelSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const DynamicCategoryModel = mongoose.model('calculation_dynamic_category', DynamicCategoryModelSchema);

module.exports = DynamicCategoryModel;
