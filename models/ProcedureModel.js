const mongoose = require('mongoose');

const ProcedureSchema = mongoose.Schema({
  pdf: {
    type: String,
    required: true,
  },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const ProcedureModel = mongoose.model('procedure_pdf', ProcedureSchema);

module.exports = ProcedureModel;
