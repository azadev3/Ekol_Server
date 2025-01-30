const express = require("express");
const router = express.Router();
const multer = require("multer");
const CategoryModel = require("../models/DynamicCategoryModel");
const upload = require("../config/MulterConfig");

router.post("/dynamic-category", upload.any(), async (req, res) => {
    try {
        const { category_title, product } = req.body;

        if (!category_title || !product) {
            return res.status(400).json({ message: "Eksik veri gönderildi." });
        }

        let parsedProducts = [];
        try {
            parsedProducts = JSON.parse(product); 
        } catch (err) {
            return res.status(400).json({ message: "Ürün verisi JSON formatında olmalı." });
        }

        const processedProducts = parsedProducts.map((p, index) => ({
            title: {
                az: p.titleAz || "",
                en: p.titleEn || "",
                ru: p.titleRu || "",
            },
            pdf: {
                az: req.files.find(file => file.fieldname === `product_${index}_pdf_az`)?.path || "",
                en: req.files.find(file => file.fieldname === `product_${index}_pdf_en`)?.path || "",
                ru: req.files.find(file => file.fieldname === `product_${index}_pdf_ru`)?.path || "",
            },
        }));

        const newCategory = new CategoryModel({
            category_title: {
                az: category_title.az,
                en: category_title.en,
                ru: category_title.ru
            },
            product: processedProducts
        });

        await newCategory.save();

        res.status(201).json({ message: "Başarıyla eklendi", data: newCategory });
    } catch (error) {
        console.error("Sunucu hatası:", error);
        res.status(500).json({ message: "Sunucu hatası!" });
    }
});

module.exports = router;
