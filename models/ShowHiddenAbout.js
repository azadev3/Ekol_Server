const mongoose = require('mongoose');

const ShowHiddenAboutModel = mongoose.Schema({
  showed: { type: Boolean, required: true },
});

const ShowHiddenAboutSchema = mongoose.model('show_hidden_about', ShowHiddenAboutModel);

module.exports = ShowHiddenAboutSchema;
