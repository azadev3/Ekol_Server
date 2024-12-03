const mongoose = require("mongoose");

const PermissionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: false },
});

module.exports = mongoose.model("Permission", PermissionSchema);
