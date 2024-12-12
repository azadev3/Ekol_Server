const express = require("express");
const router = express.Router();
const ShowHiddenCarierModel = require("../models/ShowHiddenCarierModel");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post("/hidden-carier", async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenCarierModel.findOneAndUpdate(
      {},
      { showed: show }, 
      { upsert: true, new: true } 
    );

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/hidden-carier-front", async (req, res) => {
  try {
    const showState = await ShowHiddenCarierModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
