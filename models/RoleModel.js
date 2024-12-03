const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
  name: { type: String, required: true }, 
  role_permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }], 
});

module.exports = mongoose.model("Role", RoleSchema);
