const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Videos = require("../models/VideosModel");

router.post("/videos", upload.none(), async (req, res) => {
  try {
    const { video } = req.body;

    if (!video) {
      return res.status(400).json({ error: `Missing field: ${video}` });
    }

    const createData = new Videos({
      video: video,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/videos", async (req, res) => {
  try {
    const datas = await Videos.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/videos/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Videos.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/videos/:editid", upload.none(), async (req, res) => {
  try {
    const { editid } = req.params;
    const { video } = req.body;

    const updatedVideos = await Videos.findByIdAndUpdate(
      editid,
      {
        $set: {
          video: video,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedVideos) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedVideos);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/videos/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Videos.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/videosfront", async (req, res) => {
  try {
    const datas = await Videos.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      video: data.video,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
