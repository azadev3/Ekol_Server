const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storageForPurchase = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../purchasePdf"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadPurchase = multer({ storage: storageForPurchase });

module.exports = uploadPurchase;
