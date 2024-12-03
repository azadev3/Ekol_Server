const mongoose = require("mongoose");

const NewUserSchema = mongoose.Schema({
  name_surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  status: { type: Boolean, required: false, default: true }, 
});

module.exports = mongoose.model("createdUser", NewUserSchema);
