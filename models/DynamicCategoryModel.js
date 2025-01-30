const mongoose = require('mongoose');

const DynamicCategorySchema = mongoose.Schema({
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

const DynamicCategoryModel = mongoose.model('category_calc', DynamicCategorySchema);

module.exports = DynamicCategoryModel;
