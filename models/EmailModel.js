const mongoose = require("mongoose");

const EmailSchema = mongoose.Schema({
     email: { type: String, required: true },
});

const EmailModel = mongoose.model("email", EmailSchema);

module.exports = EmailModel;