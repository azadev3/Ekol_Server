const express = require("express");
const router = express.Router();
const RoleModel = require("../models/RoleModel");
const PermissionModel = require("../models/PermissionModel");

router.post("/create_role", async (req, res) => {
  try {
    const { role_name, permissions } = req.body;

    if (!role_name || !permissions || permissions.length === 0) {
      return res.status(400).json({ error: "Role name and permissions are required" });
    }

    const foundPermissions = await PermissionModel.find({ name: { $in: permissions } });

    if (foundPermissions.length !== permissions.length) {
      return res.status(400).json({ error: "Some permissions were not found" });
    }

    const roleModel = new RoleModel({
      name: role_name,
      role_permissions: foundPermissions.map((perm) => perm._id),
    });

    const savedata = await roleModel.save();

    return res.status(200).json({ msg: "Successfully added role!", savedata });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/create_role", async (req, res) => {
  try {
    const roles = await RoleModel.find().populate("role_permissions");

    if (roles.length === 0) {
      return res.status(400).json({ msg: "No roles found" });
    }

    return res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/create_role/:id", async (req, res) => {
  try {
    const { role_name, permissions } = req.body;
    const { id } = req.params;

    const role = await RoleModel.findById(id);
    if (!role) {
      return res.status(404).json({ error: "role not found" });
    }

    const foundPermissions = await PermissionModel.find({ name: { $in: permissions } });

    if (foundPermissions.length !== permissions.length) {
      return res.status(400).json({ error: "Some permissions were not found" });
    }

    const newPerms = foundPermissions.map((perm) => perm._id);
    role.role_permissions = [...new Set([...role.role_permissions, ...newPerms])];

    if (role_name) {
      role.name = role_name;
    }

    await role.save();
    return res.status(200).json({ msg: "Permissions successfully updated!", role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.delete("/create_role/:role_id/:deleted_perm_id", async (req, res) => {
  try {
    const { role_id, deleted_perm_id } = req.params;

    const rolesById = await RoleModel.findById(role_id);

    if (!rolesById) {
      return res.status(404).json({ message: "Role not found" });
    }

    const deletedPerm = rolesById.role_permissions.filter((perm) => perm.toString() !== deleted_perm_id.toString());

    if (deletedPerm.length === rolesById.role_permissions.length) {
      return res.status(400).json({ message: "Permission not found for deletion" });
    }

    rolesById.role_permissions = deletedPerm;
    await rolesById.save();

    return res.status(200).json({ msg: "Successfully deleted the selected permission from the role!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
