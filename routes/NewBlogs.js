const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const NewBlogs = require("../models/NewBlogsModel");

router.post("/newblogs", upload.single("imgback"), async (req, res) => {
  try {
    const requiredFields = ["title_az", "title_en", "title_ru", "description_az", "description_en", "description_ru"];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing field: ${field}` });
      }
    }

    const imageFile = req.file ? `/public/${req.file.filename}` : "";

    const createData = new NewBlogs({
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
      image: imageFile,
    });

    const savedData = await createData.save();

    return res.status(200).json(savedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/newblogs", async (req, res) => {
  try {
    const datas = await NewBlogs.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/newblogs/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await NewBlogs.findById(editid).lean().exec();

    if (!datasForId) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/newblogs/:editid", upload.single("imgback"), async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

    const updatedNewBlog = await NewBlogs.findByIdAndUpdate(
      editid,
      {
        $set: {
          title: {
            az: title_az,
            en: title_en,
            ru: title_ru,
          },
          description: {
            az: description_az,
            en: description_en,
            ru: description_ru,
          },
          image: req.file ? `/public/${req.file.filename}` : "",
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedNewBlog) {
      return res.status(404).json({ error: "not found editid" });
    }

    return res.status(200).json(updatedNewBlog);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/newblogs/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await NewBlogs.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "dont delete data or not found data or another error" });
    }

    return res.status(200).json({ message: "successfully deleted data" });
  } catch (error) {}
});

// for front

router.get("/newblogfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await NewBlogs.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/lastnewblog", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const lastnewblog = await NewBlogs.find().sort({ createdAt: -1 }).limit(5).lean();
    if (!lastnewblog || lastnewblog.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    const filteredData = lastnewblog.map((data) => ({
      title: data.title[preferredLanguage],
      description: data.description[preferredLanguage],
      image: data.image,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }));

    return res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Failed to fetch last blogs" });
  }
});

module.exports = router;