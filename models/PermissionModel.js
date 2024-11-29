const mongoose = require("mongoose");

const PermissionSchema = mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

module.exports = mongoose.model("Permission", PermissionSchema);
