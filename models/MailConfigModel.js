const mongoose = require('mongoose');

const MailConfigSchema = mongoose.Schema({
  host: { type: String, required: true },
  port: { type: Number, required: false, default: 465 },
  user: { type: String, required: true },
  pass: { type: String, required: true },
});
