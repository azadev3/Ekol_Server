const mongoose = require('mongoose');

const ShowHiddenMediaSchema = mongoose.Schema({
  showed: { type: Boolean, required: true },
});

const ShowHiddenMediaModel = mongoose.model('show_hidden_media', ShowHiddenMediaSchema);

module.exports = ShowHiddenMediaModel;
