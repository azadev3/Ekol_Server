const mongoose = require('mongoose');

const ShowHiddenSocialSchema = mongoose.Schema({
 showed: { type: Boolean, required: true },
});

const ShowHiddenSocialModel = mongoose.model('show_hidden_social', ShowHiddenSocialSchema);

module.exports = ShowHiddenSocialModel;
