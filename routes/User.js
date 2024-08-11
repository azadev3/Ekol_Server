const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // req.file yerine req.body kullanmalısınız

  try {
    // 1. Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Not found user" });
    }

    // 2. Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(402).json({ message: "Invalid email or password" });
    }

    // 3. JWT token oluştur
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // 4. Token'i kullanıcıya gönder
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
