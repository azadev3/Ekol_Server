const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Structures = require("../models/Structures");

router.post("/departments", async (req, res) => {
  try {
    const { title_az, title_en, title_ru, category } = req.body;

    // Validate required fields
    if (!title_az || !title_en || !title_ru || !category) {
      return res.status(400).json({ error: "Bütün xanaları doldurun." });
    }

    // Create a new Structures document
    const newDepartment = new Structures({
      departments: {
        title: {
          az: title_az,
          en: title_en,
          ru: title_ru,
        },
        category: category,
      },
    });

    // Save the document
    const savedDepartment = await newDepartment.save();

    return res.status(200).json(savedDepartment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve all Structures documents
router.get("/departments", async (req, res) => {
  try {
    const departments = await Structures.find();
    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve a single Structures by ID
router.get("/departments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Structures.findById(id);
    if (!department) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json(department);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT: Update a Structures by ID
router.put("/departments/:editid", async (req, res) => {
  try {
    const { editid } = req.params;
    const { title_az, title_en, title_ru, category } = req.body;

    const updateData = {
      departments: {
        title: {
          az: title_az,
          en: title_en,
          ru: title_ru,
        },
        category: category,
      },
    };

    const updatedDepartment = await Structures.findByIdAndUpdate(editid, updateData, { new: true });
    if (!updatedDepartment) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json(updatedDepartment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove a Structures by ID
router.delete("/departments/:deleteid", async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deletedDepartment = await Structures.findByIdAndDelete(deleteid);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET: Send all data for front
router.get("/departmentsfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const prefferedLanguage = acceptLanguage.split(",")[0].split(";")[0];
    const datas = await Structures.find();

    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => {
      const department = data.departments;
      const title = department.title[prefferedLanguage];
      const category = department.category;

      return {
        departments: {
          title: title,
          category: category,
        },
      };
    });

    return res.status(200).json(filteredData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
