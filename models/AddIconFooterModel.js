const mongoose = require('mongoose');

const AddIconFooterSchema = mongoose.Schema({
    color: { type: String, required: false, default: '' },
    title: { type: String, required: false, default: '' },
    url: { type: String, required: false, default: '' },
    icon: { type: String, required: true },
});

const AddIconFooterModel = mongoose.model('icon_footer', AddIconFooterSchema); 

module.exports = AddIconFooterModel;