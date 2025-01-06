const mongoose = require('mongoose');

const ShowHiddenHeroSchema = mongoose.Schema({
  showed: { type: Boolean, required: true },
});

const ShowHiddenHeroModel = mongoose.model('show_hidden_hero', ShowHiddenHeroSchema);

module.exports = ShowHiddenHeroModel;
