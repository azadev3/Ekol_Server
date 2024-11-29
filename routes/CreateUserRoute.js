const express = require("express");
const router = express.Router();
const CreateUserModel = require("../models/CreateUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/create_new_user", async (req, res) => {
  try {
    const { name_surname, email, password, user_role } = req.body;

    if (!name_surname || !email || !password || !user_role) {
      return res.status(400).json({ msg: "Required all fields!" });
    }

    const existingUser = await CreateUserModel.find({ email: email });
    if (!existingUser) {
      return res.status(401).json({ message: "user has already been declared" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const savedata = new CreateUserModel({
      name_surname: name_surname,
      email: email,
      password: hashedPassword,
      user_role: user_role,
    });

    await savedata.save();

    const token = jwt.sign({ user_id: savedata._id, user_role: savedata.user_role }, process.env.JWT_SECRET);

    const userData = {
      name_surname: savedata.name_surname,
      email: savedata.email,
      user_role: savedata.user_role,
    };

    return res.status(200).json({
      message: "user created is successfully",
      token: token,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/create_new_user", async (req, res) => {
  try {
    const users = await CreateUserModel.find();
    if (!users) {
      return res.status(400).json({ message: "Not found users" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
