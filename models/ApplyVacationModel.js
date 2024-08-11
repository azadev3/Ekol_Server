const mongoose = require("mongoose");

const ApplyVacationSchema = mongoose.Schema({
  cv: { type: String },
  email: { type: String },
  name: { type: String },
  profile: { type: String },
  surname: { type: String },
  telephone: { type: String },
  apply_vacation_name: { type: String },
  applyDate: { type: String },
});

const ApplyVacationModel = mongoose.model("applyvacation", ApplyVacationSchema);

module.exports = ApplyVacationModel;
