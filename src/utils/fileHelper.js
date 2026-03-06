const path = require("path");
const fs = require("fs");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");
const PROCESSED_DIR = path.join(__dirname, "../../processed");

function ensureDirs() {
  [UPLOADS_DIR, PROCESSED_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function getUploadPath(filename) {
  return path.join(UPLOADS_DIR, filename);
}

function getProcessedPath(filename) {
  return path.join(PROCESSED_DIR, filename);
}

function deleteFile(filepath) {
  try {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  } catch (err) {
    console.error("Failed to delete file:", err.message);
  }
}

function getFileSizeKB(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return (stats.size / 1024).toFixed(2);
  } catch {
    return null;
  }
}

module.exports = { ensureDirs, getUploadPath, getProcessedPath, deleteFile, getFileSizeKB, UPLOADS_DIR, PROCESSED_DIR };
