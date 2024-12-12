const mongoose = require('mongoose');

const ShowHiddenPurchaseSchema = mongoose.Schema({
 showed: { type: Boolean, required: true },
});

const ShowHiddenPurchaseModel = mongoose.model('show_hidden_satinalmalar', ShowHiddenPurchaseSchema);

module.exports = ShowHiddenPurchaseModel;
