const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const uploadConfig = multer({ storage });

const useSharp = async (buffer, outputPath) => {
  try {
    await sharp(buffer).webp({ quality: 100 }).toFile(outputPath);

    console.log("ok sharp!");
  } catch (error) {
    console.log("error sharp!", error);
  }
};

module.exports = { uploadConfig, useSharp };
