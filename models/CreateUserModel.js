const mongoose = require("mongoose");

const NewUserSchema = mongoose.Schema({
  name_surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  permission: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});

module.exports = mongoose.model("createdUser", NewUserSchema);
