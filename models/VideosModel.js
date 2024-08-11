const mongoose = require("mongoose");

const VideosSchema = mongoose.Schema({
     video: { type: String, required: true },
});

const VideosModel = mongoose.model("videos", VideosSchema);

module.exports = VideosModel;