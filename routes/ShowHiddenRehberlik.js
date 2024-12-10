const express = require("express");
const router = express.Router();
const ShowHiddenRehberlikModel = require("../models/ShowHiddenRehberlikModel");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post("/hidden-rehberlik", async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenRehberlikModel.findOneAndUpdate(
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

router.get("/hidden-rehberlik-front", async (req, res) => {
  try {
    const showState = await ShowHiddenRehberlikModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
