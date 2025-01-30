const express = require("express");
const router = express.Router();
const multer = require("multer");
const CategoryModel = require("../models/DynamicCategoryModel");
const upload = require("../config/MulterConfig");

router.post("/dynamic-category", upload.any(), async (req, res) => {
    try {
        const { category_title, product } = req.body;
        
        const processedProducts = product.map((p, index) => {
            return {
                title: {
                    az: p.title.az,
                    en: p.title.en,
                    ru: p.title.ru
                },
                pdf: {
                    az: req.files.find(f => f.fieldname === `product[${index}][pdf][az]`)?.path || '',
                    en: req.files.find(f => f.fieldname === `product[${index}][pdf][en]`)?.path || '',
                    ru: req.files.find(f => f.fieldname === `product[${index}][pdf][ru]`)?.path || '',
                }
            };
        });

        const newCategory = new CategoryModel({
            category_title: {
                az: category_title.az,
                en: category_title.en,
                ru: category_title.ru
            },
            product: processedProducts
        });

        await newCategory.save();

        res.status(201).json({ message: "Successfully added Dynamic Category", data: newCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
});



module.exports = router;
