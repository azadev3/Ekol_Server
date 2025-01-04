const mongoose = require('mongoose');

const ProcedureSchema = mongoose.Schema({
  pdf: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
  },
});

const ProcedureModel = mongoose.model('procedure_pdf', ProcedureSchema);

module.exports = ProcedureModel;
