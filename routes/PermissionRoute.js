const express = require("express");
const router = express.Router();
const PermissionModel = require("../models/PermissionModel");

router.post("/create_permission", async (req, res) => {
  try {
    const { permission_name } = req.body;

    if (!permission_name) {
      res.status(500).json({ error: "permission name is required" });
    }

    const permissionModel = new PermissionModel({
      name: permission_name,
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

