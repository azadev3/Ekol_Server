const mongoose = require("mongoose");

const PermissionSchema = mongoose.Schema({
  name: { type: String, required: false },
  key: { type: String, required: false },
});

module.exports = mongoose.model("Permission", PermissionSchema);
