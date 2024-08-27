const mongoose = require("mongoose");

const NewBlogSchema = mongoose.Schema({
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

const NewBlogModel = mongoose.model("newblogmodel", NewBlogSchema);

module.exports = NewBlogModel;
