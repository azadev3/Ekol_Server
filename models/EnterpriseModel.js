const mongoose = require("mongoose");

const EnterpriseSchema = mongoose.Schema({
  name: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, 
      value: { type: String, required: true },
    },
  ],
});

const EnterpriseModel = mongoose.model("enterprise_model", EnterpriseSchema);

module.exports = EnterpriseModel;
