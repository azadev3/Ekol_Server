const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
     name: { type: String, required: true },
     description: { type: String, required: false, default: "" },
});

module.exports = mongoose.model("Role", RoleSchema);
