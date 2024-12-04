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

    const existingUser = await CreateUserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(401).json({ message: "User has already been declared" });
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

router.post("/login_new_user", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password is required!" });
    }

    const user = await CreateUserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user.status) {
      return res.status(405).json({ message: "Account is deactive." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password invalid!" });
    }

    const token = jwt.sign({ user_id: user._id, user_role: user.user_role }, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "Login success!",
      token: token,
      user: {
        name_surname: user.name_surname,
        email: user.email,
        user_role: user.user_role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sunucu hatası." });
  }
});

router.post("/login_new_user/status_update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await CreateUserModel.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.status = status;

    await user.save();

    return res.status(200).json({ msg: "User status updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
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

router.delete("/delete_user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await CreateUserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ message: "user deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error delete user" });
  }
});

router.put("/create_new_user/update_role/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_role } = req.body;

    const user = await CreateUserModel.findByIdAndUpdate(id, { $set: { user_role } }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({ message: "User role updated successfully!", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "updated role error on the user" });
  }
});

module.exports = router;
