const express = require("express");
const router = express.Router();
const ShowHiddenPurchaseModel = require("../models/ShowHiddenPurchaseModel");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post("/hidden-purchase", async (req, res) => {
  try {
    const { show } = req.body;

    const saved = await ShowHiddenPurchaseModel.findOneAndUpdate(
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

router.get("/hidden-purchase-front", async (req, res) => {
  try {
    const showState = await ShowHiddenPurchaseModel.findOne();

    return res.status(200).json(showState);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
