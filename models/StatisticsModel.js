const mongoose = require('mongoose');

const StatisticsWorksSchema = mongoose.Schema({
 title: {
  az: String,
  en: String,
  ru: String,
 },
 count: {
  type: String,
  required: true,
 },
 statusActive: {
  type: Boolean,
  default: true,
  required: false,
 },
});

const StatisticsModel = mongoose.model('statistics', StatisticsWorksSchema);

module.exports = StatisticsModel;
