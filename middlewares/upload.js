const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  limits: {
    fileSize: 500000,
  },
});

const upload = multer({
  storage: multerConfig,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed!"));
  },
});

module.exports = upload;
