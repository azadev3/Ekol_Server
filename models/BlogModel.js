const mongoose = require("mongoose");


const BlogSchema = mongoose.Schema({
  title: {
    az: String,
    en: String,
    ru: String,
  },
  description: {
    az: String,
    en: String,
    ru: String,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const BlogModel = mongoose.model("blogmodel", BlogSchema);

module.exports = BlogModel;
