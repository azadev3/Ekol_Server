const mongoose = require('mongoose');

const ShowHiddenActivitySchema = mongoose.Schema({
  showed: { type: Boolean, required: true },
});

const ShowHiddenActivityModel = mongoose.model('show_hidden_activity', ShowHiddenActivitySchema);

module.exports = ShowHiddenActivityModel;
