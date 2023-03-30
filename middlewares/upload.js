const multer = require("multer");
const path = require("path");

const tempDir = path.resolve(__dirname, "../", "temp");

const configMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: configMulter,
});

module.exports = upload;
