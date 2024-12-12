const mongoose = require('mongoose');

const ShowHiddenCarierSchema = mongoose.Schema({
 showed: { type: Boolean, required: true },
});

const ShowHiddenCarierModel = mongoose.model('show_hidden_carier', ShowHiddenCarierSchema);

module.exports = ShowHiddenCarierModel;
