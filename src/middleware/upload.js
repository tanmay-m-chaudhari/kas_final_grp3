const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { UPLOADS_DIR } = require("../utils/fileHelper");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/tiff", "image/avif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

module.exports = upload;
