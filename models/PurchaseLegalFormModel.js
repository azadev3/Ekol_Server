const mongoose = require("mongoose");

// Legal Form Schema
const LegalFormSchema = mongoose.Schema({
  company: { type: String, required: true },
  voen: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  mobtel: { type: String, required: true },
  worktel: { type: String, required: true },
  email: { type: String, required: true },
  other: { type: String, required: true },
  country: { type: String, required: true },
  job: { type: String, required: true },
  location: { type: String, required: true },
  enterprisename: { type: String, required: true },
  enterpriseNameOrTel: { type: String, required: true },
  enterprisepart: { type: String, required: true },
  typeofrequest: { type: String, required: true },
  requestpdf: { type: String, required: true }, // Consider storing a URL or file info
  message: { type: String, required: true },
  isResponsible: { type: String, required: true },
  namesecond: { type: String, required: true },
  surnamesecond: { type: String, required: true },
  mobtelsecond: { type: String, required: true },
  worktelsecond: { type: String, required: true },
  emailsecond: { type: String, required: true },
  othersecond: { type: String, required: true },
});

// // Natural Form Schema
// const NaturalFormSchema = mongoose.Schema({
//   voen: { type: String, required: true },
//   name: { type: String, required: true },
//   surname: { type: String, required: true },
//   mobtel: { type: String, required: true },
//   email: { type: String, required: true },
//   location: { type: String, required: true },
//   enterprisename: { type: String, required: true },
//   enterpriseNameOrTel: { type: String, required: true },
//   enterprisepart: { type: String, required: true },
//   typeofrequest: { type: String, required: true },
//   message: { type: String, required: true },
//   requestpdf: { type: String, required: true }, // Consider storing a URL or file info
//   country: { type: String, required: true },
// });

const PurchaseLegalFormModel = mongoose.model("PurchaseLegalForm", LegalFormSchema);

module.exports = PurchaseLegalFormModel;
