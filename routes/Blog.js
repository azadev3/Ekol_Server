const express = require("express");
const router = express.Router();
const Blog = require("../models/BlogModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { uploadConfig, useSharp } = require("../config/MulterC");
const mountPath = require("../config/mountPath");
const checkUser = require("../middlewares/checkUser");
const checkPermission = require("../middlewares/checkPermissions");

router.post(
  "/blog",
  checkUser,
  checkPermission("create_xeberler"),
  uploadConfig.single("imgback"),
  async (req, res) => {
    try {
      let imageFile = "";
      if (req.file) {
        const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
        const imgOutputPath = path.join(mountPath, imgFileName);
        await useSharp(req.file ? req.file.buffer : "", imgOutputPath);
        imageFile = `/public/${imgFileName}`;
      }

      const createData = new Blog({
        title: {
          az: req.body.title_az,
          en: req.body.title_en,
          ru: req.body.title_ru,
        },
        description: {
          az: req.body.description_az,
          en: req.body.description_en,
          ru: req.body.description_ru,
        },
        created_at: req.body.created_at,
        updated: req.body.updated,
        image: imageFile,
        status: req.body.status || true,
      });

      const savedData = await createData.save();
      return res.status(200).json(savedData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/blog", checkUser, checkPermission("list_xeberler"), async (req, res) => {
  try {
    const datas = await Blog.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/blog/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Blog.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

// router.put("/blog/:editid", uploadConfig.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     let imageFile = "";
//     if (req.file) {
//       const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
//       const imgOutputPath = path.join(mountPath, imgFileName);
//       await useSharp(req.file ? req.file.buffer : "", imgOutputPath);
//       imageFile = `/public/${imgFileName}`;
//     }

//     const updatedBlog = await Blog.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           title: {
//             az: req.body.title_az,
//             en: req.body.title_en,
//             ru: req.body.title_ru,
//           },
//           description: {
//             az: req.body.description_az,
//             en: req.body.description_en,
//             ru: req.body.description_ru,
//           },
//           image: imageFile,
//           created_at: req.body.created_at,
//           updated: req.body.updated,
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedBlog) {
//       return res.status(404).json({ error: "not found editid" });
//     }

//     return res.status(200).json(updatedBlog);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put(
  "/blog/:editid",
  checkUser,
  checkPermission("update_xeberler"),
  uploadConfig.single("imgback"),
  async (req, res) => {
    try {
      const { editid } = req.params;
      const { title_az, title_en, title_ru, description_az, description_en, description_ru, created_at, updated } =
        req.body;

      const existingBlog = await Blog.findById(editid).exec();
      if (!existingBlog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      const updatedData = {};

      updatedData.title = {
        az: title_az || existingBlog.title.az,
        en: title_en || existingBlog.title.en,
        ru: title_ru || existingBlog.title.ru,
      };

      updatedData.description = {
        az: description_az || existingBlog.description.az,
        en: description_en || existingBlog.description.en,
        ru: description_ru || existingBlog.description.ru,
      };

      updatedData.created_at = created_at || existingBlog.created_at;
      updatedData.updated = updated || existingBlog.updated;

      let imageFile = existingBlog.image;
      if (req.file) {
        const imgFileName = `${uuidv4()}-${Date.now()}.webp`;
        const imgOutputPath = path.join(mountPath, imgFileName);
        await useSharp(req.file ? req.file.buffer : "", imgOutputPath);
        imageFile = `/public/${imgFileName}`;
      }
      updatedData.image = imageFile;

      if (Object.keys(updatedData).length === 0) {
        return res.status(200).json(existingBlog);
      }

      const updatedBlog = await Blog.findByIdAndUpdate(editid, { $set: updatedData }, { new: true }).lean().exec();

      return res.status(200).json(updatedBlog);
    } catch (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.put("/blog/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ error: "Status must be a boolean value" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, { status: status }, { new: true }).lean().exec();

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/blog/:deleteid", checkUser, checkPermission("delete_xeberler"), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Blog.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front
router.get("/blogfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await Blog.find({ status: true });
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      created_at: data.created_at,
      updated: data.updated,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/lastblogs", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const lastBlogs = await Blog.find({ status: true }).sort({ created_at: -1 }).limit(5).lean();
    if (!lastBlogs || lastBlogs.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    const filteredData = lastBlogs.map((data) => ({
      _id: data._id,
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      created_at: data.created_at,
      updatedAt: data.updatedAt,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Failed to fetch last blogs" });
  }
});

module.exports = router;
