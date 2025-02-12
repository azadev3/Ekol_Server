const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Statistics = require("../models/StatisticsModel");
const checkUser = require("../middlewares/checkUser");
const checkPermission = require("../middlewares/checkPermissions");

router.post("/statistics", checkUser, checkPermission("create_statistikalar"), upload.none(), async (req, res) => {
  try {
    const { title_az, title_en, title_ru, count } = req.body;
    if (!title_az || !title_en || !title_ru || !count) {
      return res.status(400).json({ error: "Missing field" });
    }

    const createData = new Statistics({
      title: {
        az: title_az,
        en: title_en,
        ru: title_ru,
      },
      count: count,
   statusActive: req.body.statusActive || true,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/statistics", checkUser, checkPermission("list_statistikalar"), async (req, res) => {
  try {
    const datas = await Statistics.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/statistics/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Statistics.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/statistics/:editid", checkUser, checkPermission("edit_statistikalar"), upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, count } = req.body;

    const updatedStatistics = await Statistics.findByIdAndUpdate(
      editid,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          count: count,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedStatistics) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedStatistics);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/statistics/:deleteid", checkUser, checkPermission("delete_statistikalar"), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Statistics.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/statistics/status/:id', async (req, res) => {
  try {
   const { id } = req.params;
   const { statusActive } = req.body;
 
   if (typeof statusActive !== 'boolean') {
    return res.status(400).json({ error: 'Status must be a boolean value' });
   }
 
   const updatedPurch = await Statistics.findByIdAndUpdate(id, { statusActive: statusActive }, { new: true }).lean().exec();
 
   if (!updatedPurch) {
    return res.status(404).json({ error: ' not found' });
   }
 
   return res.status(200).json(updatedPurch);
  } catch (error) {
   console.error('Error updating status:', error);
   return res.status(500).json({ error: error.message });
  }
 });

// for front
router.get("/statisticsfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await Statistics.find({ statusActive: true });
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      title: data.title[preferredLanguage],
      count: data.count,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
