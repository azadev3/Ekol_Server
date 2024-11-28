const express = require("express");
const router = express.Router();
const RoleModel = require("../models/RoleModel");

router.post("/create_role", async (req, res) => {
  try {
    const { role_name, role_description } = req.body;

    if (!role_name) {
      res.status(500).json({ error: "Role name is required" });
    }

    const roleModel = new RoleModel({
      name: role_name,
      description: role_description || "",
    });

    const savedata = await roleModel.save();

    return res.status(200).json({ msg: "Successfully added role!", savedata });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
