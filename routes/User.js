const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body; 

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Not found user" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(402).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
