const express = require("express");
const router = express.Router();
const Emails = require("../models/EmailModel");

router.post("/emails", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (!email) {
      return res.status(500).json({ message: "email empty" });
    }

    const saveEmail = new Emails({
      email: email,
    });

    const saved = await saveEmail.save();
    return res.status(200).json({ savedemail: saved });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/emails", async (req, res) => {
  try {
    const emails = await Emails.find();
    return res.status(200).json({ emails: emails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
