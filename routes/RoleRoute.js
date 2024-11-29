const express = require("express");
const router = express.Router();
const RoleModel = require("../models/RoleModel");
const PermissionModel = require("../models/PermissionModel");

router.post("/create_role", async (req, res) => {
  try {
    const { role_name, role_description, permissions } = req.body;

    if (!role_name || !permissions || permissions.length === 0) {
      return res.status(400).json({ error: "Role name and permissions are required" });
    }

    const foundPermissions = await PermissionModel.find({ name: { $in: permissions } });

    if (foundPermissions?.length !== permissions?.length) {
      return res.status(400).json({ error: "not found permissions" });
    }

    const roleModel = new RoleModel({
      name: role_name,
      description: role_description || "",
      permissions: foundPermissions.map((perm) => perm.name),
    });

    const savedata = await roleModel.save();

    return res.status(200).json({ msg: "Successfully added role!", savedata });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

router.get("/create_role", async (req, res) => {
  const roles = await RoleModel.find().populate("role_permissions");

  if (!roles) {
    return res.status(400).json({ msg: "roles is empty" });
  }

  return res.status(200).json(roles);
});

module.exports = router;
