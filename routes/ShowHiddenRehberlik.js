const express = require("express");
const router = express.Router();
const ShowHiddenRehberlikModel = require("../models/ShowHiddenRehberlikModel");

router.post("/hidden-rehberlik", async (req, res) => {
  try {
    const { show } = req.body;
    const saveshow = ShowHiddenRehberlikModel({
      showed: show,
    });

    const saved = await saveshow.save();

    return res.status(200).json({ saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/hidden-rehberlik-front", async (req, res) => {
  try {
    const showState = await ShowHiddenRehberlikModel.find();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
