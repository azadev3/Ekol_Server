const mongoose = require("mongoose");

const ShowHiddenRehberlikSchema = mongoose.Schema({
  showed: { type: Boolean, required: true },
});

const ShowHiddenRehberlikModel = mongoose.model("show_hidden_rehberlik", ShowHiddenRehberlikSchema);

module.exports = ShowHiddenRehberlikModel;
