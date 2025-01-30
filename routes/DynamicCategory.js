const express = require("express");
const router = express.Router();
const multer = require("multer");
const CategoryModel = require("../models/DynamicCategoryModel");
const upload = require("../config/MulterConfig");

router.post("/dynamic-category", upload.fields([
    { name: "product[][pdf][az]" },
    { name: "product[][pdf][en]" },
    { name: "product[][pdf][ru]" }
]), async (req, res) => {
    try {
        const { category_title, product } = req.body;

        const newCategory = new CategoryModel({
            category_title: {
                az: category_title.az,
                en: category_title.en,
                ru: category_title.ru
            },
            product: product.map((p, index) => ({
                title: {
                    az: p.title.az,
                    en: p.title.en,
                    ru: p.title.ru,
                },
                pdf: {
                    az: req.files?.[`product[${index}][pdf][az]`] ? req.files[`product[${index}][pdf][az]`][0].path : "",
                    en: req.files?.[`product[${index}][pdf][en]`] ? req.files[`product[${index}][pdf][en]`][0].path : "",
                    ru: req.files?.[`product[${index}][pdf][ru]`] ? req.files[`product[${index}][pdf][ru]`][0].path : "",
                }
            }))
        });

        await newCategory.save();
        res.status(201).json({ message: "Category successfully created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
