const mongoose = require('mongoose');

const ShowHiddenOurWorksHomeSchema = mongoose.Schema({
  showed: { type: Boolean, required: true },
});

const ShowHiddenOurWorksHomeModel = mongoose.model('show_hidden_ourworkshome', ShowHiddenOurWorksHomeSchema);

module.exports = ShowHiddenOurWorksHomeModel;
