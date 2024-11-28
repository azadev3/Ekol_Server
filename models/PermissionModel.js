const mongoose = require("mongoose");

const PermissionSchema = mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Permission", PermissionSchema);
