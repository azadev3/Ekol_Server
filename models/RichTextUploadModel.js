const mongoose = require('mongoose');

const RichTextUploadSchema = mongoose.Schema({
     url: { type: String, required: true }
});

const RichTextUploadModel = mongoose.model("richtextupload", RichTextUploadSchema);

module.exports = RichTextUploadModel;