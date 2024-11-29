const express = require("express");
const router = express.Router();
const PermissionModel = require("../models/PermissionModel");

router.post("/create_permission", async (req, res) => {
  try {
    const { permission_name, permission_key } = req.body;

    if (!permission_name || !permission_key) {
      res.status(500).json({ error: "permission name and key is required" });
    }

    const permissionModel = new PermissionModel({
      name: permission_name,
      value: permission_key,
    });

    const savedata = await permissionModel.save();

    return res.status(200).json({ msg: "Successfully added permission!", savedata });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get("/create_permission", async (req, res) => {
  const perms = await PermissionModel.find();
  if (!perms) {
    return res.status(400).json({ msg: "permissions is empty" });
  }

  return res.status(200).json(perms);
});

module.exports = router;
