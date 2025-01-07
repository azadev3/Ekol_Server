const mongoose = require('mongoose');

const FaviconSchema = mongoose.Schema({
  favicon: {
    type: String,
    required: false,
    default: '',
  },
});

const FaviconModel = mongoose.model('meta_favicon', FaviconSchema);

module.exports = FaviconModel;
