const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storageForRichText = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../richtextuploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const uploadRichText = multer({ storage: storageForRichText });

module.exports = uploadRichText;
