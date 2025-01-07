const mongoose = require('mongoose');

const ShowHiddenContactSchema = mongoose.Schema({
  showed: { type: Boolean, required: true },
});

const ShowHiddenContactModel = mongoose.model('show_hidden_contact', ShowHiddenContactSchema);

module.exports = ShowHiddenContactModel;
