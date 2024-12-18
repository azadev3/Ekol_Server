const mongoose = require('mongoose');

const StageSchema = mongoose.Schema({
 name: [
  {
   _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
   value: { type: String, required: true },
  },
 ],
});

const StageModel = mongoose.model('stage_model', StageSchema);

module.exports = StageModel;
