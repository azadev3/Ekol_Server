const mongoose = require("mongoose");

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
});

const StatisticsModel = mongoose.model("statistics", StatisticsWorksSchema);

module.exports = StatisticsModel;
