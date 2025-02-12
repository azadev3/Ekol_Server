const mongoose = require('mongoose');

const AddIconMapSchema = mongoose.Schema({
  color: { type: String, required: false, default: '' },
  title: { type: String, required: false, default: '' },
  url: { type: String, required: false, default: '' },
  icon: { type: String, required: true },
});

const AddIconMapModel = mongoose.model('icon_map', AddIconMapSchema);

module.exports = AddIconMapModel;
