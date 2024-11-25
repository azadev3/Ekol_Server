const OurWorksImageModel = require("../models/OurWorksImageModel");
const express = require("express");
const router = express.Router();
const { uploadConfig, useSharp } = require("../config/MulterC");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const mountPath = require("../config/mountPath");
// Multiple file handling
router.post("/ourworksimages", uploadConfig.array("newImages"), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const imageFilePaths = [];
    for (let file of files) {
      const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
      const imgOutputPath = path.join(mountPath, imgFileName);

      await useSharp(file.buffer, imgOutputPath);

      imageFilePaths.push(`/public/${imgFileName}`);
    }

    const createData = new OurWorksImageModel({
      selected_ourworks: req.body.selected_ourworks,
      images: imageFilePaths,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ourworksimages", async (req, res) => {
  try {
    const datas = await OurWorksImageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/ourworksimages/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await OurWorksImageModel.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/ourworksimages/:editid", uploadConfig.array("newImages"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { selected_ourworks } = req.body;

//     // Img
//     const files = req.files;
//     if (!files || files.length === 0) {
//       return res.status(400).json({ error: "No images uploaded" });
//     }

//     const imageFilePaths = [];
//     for (let file of files) {
//       const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
//       const imgOutputPath = path.join(mountPath, imgFileName);

//       await useSharp(file.buffer, imgOutputPath);

//       imageFilePaths.push(`/public/${imgFileName}`);
//     }

//     const updatedOurworksImages = await OurWorksImageModel.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           selected_ourworks: selected_ourworks,
//           images: imageFilePaths,
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedOurworksImages) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedOurworksImages);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });


router.put("/ourworksimages/:editid", uploadConfig.array("newImages"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { selected_ourworks } = req.body;

    const existingOurworksImages = await OurWorksImageModel.findById(editid).exec();

    if (!existingOurworksImages) {
      return res.status(404).json({ error: "Our works images not found" });
    }

    const updatedData = {};

    if (selected_ourworks) {
      updatedData.selected_ourworks = selected_ourworks;
    }

    if (req.files && req.files.length > 0) {
      const imageFilePaths = [];
      for (let file of req.files) {
        const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
        const imgOutputPath = path.join(mountPath, imgFileName);
        await useSharp(file.buffer, imgOutputPath);
        imageFilePaths.push(`/public/${imgFileName}`);
      }

      updatedData.images = imageFilePaths;
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(200).json(existingOurworksImages);
    }

    const updatedOurworksImages = await OurWorksImageModel.findByIdAndUpdate(
      editid,
      { $set: updatedData },
      { new: true }
    ).lean().exec();

    return res.status(200).json(updatedOurworksImages);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});


router.delete("/ourworksimages/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await OurWorksImageModel.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/ourworksimagesfront", async (req, res) => {
  try {
    //     const acceptLanguage = req.headers["accept-language"];
    //     const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await OurWorksImageModel.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      selected_ourworks: data.selected_ourworks,
      images: data.images,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
