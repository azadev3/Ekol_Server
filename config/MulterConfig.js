const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const diskMountPath = '/var/data'; // Render'ın sunduğu disk mount path'i

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, diskMountPath); // Dosyalar doğrudan /var/data içine kaydedilecek
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
