const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const upload = require("../middleware/upload");
const { getProcessedPath, getFileSizeKB, deleteFile, getUploadPath } = require("../utils/fileHelper");

// POST /api/process/resize
router.post("/resize", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });

  const { width, height, fit = "cover", format = "jpeg", quality = 85 } = req.body;
  if (!width && !height) {
    deleteFile(req.file.path);
    return res.status(400).json({ error: "At least one of width or height must be provided" });
  }

  const outputFilename = `resized_${uuidv4()}.${format}`;
  const outputPath = getProcessedPath(outputFilename);

  try {
    const resizeOptions = {};
    if (width) resizeOptions.width = parseInt(width);
    if (height) resizeOptions.height = parseInt(height);
    resizeOptions.fit = fit;

    const info = await sharp(req.file.path)
      .resize(resizeOptions)
      .toFormat(format, { quality: parseInt(quality) })
      .toFile(outputPath);

    res.json({
      success: true,
      operation: "resize",
      original: { filename: req.file.originalname, size_kb: getFileSizeKB(req.file.path) },
      output: {
        filename: outputFilename,
        download_url: `/api/process/download/${outputFilename}`,
        width: info.width,
        height: info.height,
        format: info.format,
        size_kb: getFileSizeKB(outputPath),
      },
    });
  } catch (err) {
    deleteFile(req.file.path);
    deleteFile(outputPath);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

// POST /api/process/crop
router.post("/crop", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });

  const { left = 0, top = 0, width, height, format = "jpeg", quality = 85 } = req.body;
  if (!width || !height) {
    deleteFile(req.file.path);
    return res.status(400).json({ error: "width and height are required for crop" });
  }

  const outputFilename = `cropped_${uuidv4()}.${format}`;
  const outputPath = getProcessedPath(outputFilename);

  try {
    const info = await sharp(req.file.path)
      .extract({ left: parseInt(left), top: parseInt(top), width: parseInt(width), height: parseInt(height) })
      .toFormat(format, { quality: parseInt(quality) })
      .toFile(outputPath);

    res.json({
      success: true,
      operation: "crop",
      original: { filename: req.file.originalname, size_kb: getFileSizeKB(req.file.path) },
      output: {
        filename: outputFilename,
        download_url: `/api/process/download/${outputFilename}`,
        width: info.width,
        height: info.height,
        format: info.format,
        size_kb: getFileSizeKB(outputPath),
      },
    });
  } catch (err) {
    deleteFile(req.file.path);
    deleteFile(outputPath);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

// POST /api/process/convert
router.post("/convert", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });

  const { format = "webp", quality = 85 } = req.body;
  const supportedFormats = ["jpeg", "png", "webp", "avif", "tiff"];
  if (!supportedFormats.includes(format)) {
    deleteFile(req.file.path);
    return res.status(400).json({ error: `Unsupported format. Choose from: ${supportedFormats.join(", ")}` });
  }

  const outputFilename = `converted_${uuidv4()}.${format}`;
  const outputPath = getProcessedPath(outputFilename);

  try {
    const metadata = await sharp(req.file.path).metadata();
    const info = await sharp(req.file.path)
      .toFormat(format, { quality: parseInt(quality) })
      .toFile(outputPath);

    res.json({
      success: true,
      operation: "convert",
      original: { filename: req.file.originalname, format: metadata.format, size_kb: getFileSizeKB(req.file.path) },
      output: {
        filename: outputFilename,
        download_url: `/api/process/download/${outputFilename}`,
        format: info.format,
        size_kb: getFileSizeKB(outputPath),
        compression_ratio: metadata.size
          ? `${((1 - info.size / metadata.size) * 100).toFixed(1)}% smaller`
          : "N/A",
      },
    });
  } catch (err) {
    deleteFile(req.file.path);
    deleteFile(outputPath);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

// POST /api/process/transform — rotate, flip, grayscale, blur, sharpen
router.post("/transform", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });

  const { rotate = 0, flip = false, flop = false, grayscale = false, blur = 0, sharpen = false, format = "jpeg", quality = 85 } = req.body;
  const outputFilename = `transformed_${uuidv4()}.${format}`;
  const outputPath = getProcessedPath(outputFilename);

  try {
    let pipeline = sharp(req.file.path);
    if (parseInt(rotate) !== 0) pipeline = pipeline.rotate(parseInt(rotate));
    if (flip === "true" || flip === true) pipeline = pipeline.flip();
    if (flop === "true" || flop === true) pipeline = pipeline.flop();
    if (grayscale === "true" || grayscale === true) pipeline = pipeline.grayscale();
    if (parseFloat(blur) > 0) pipeline = pipeline.blur(parseFloat(blur));
    if (sharpen === "true" || sharpen === true) pipeline = pipeline.sharpen();

    const info = await pipeline.toFormat(format, { quality: parseInt(quality) }).toFile(outputPath);

    res.json({
      success: true,
      operation: "transform",
      applied: { rotate, flip, flop, grayscale, blur, sharpen },
      original: { filename: req.file.originalname, size_kb: getFileSizeKB(req.file.path) },
      output: {
        filename: outputFilename,
        download_url: `/api/process/download/${outputFilename}`,
        width: info.width,
        height: info.height,
        format: info.format,
        size_kb: getFileSizeKB(outputPath),
      },
    });
  } catch (err) {
    deleteFile(req.file.path);
    deleteFile(outputPath);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

// GET /api/process/info — get image metadata without processing
router.post("/info", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file provided" });
  try {
    const metadata = await sharp(req.file.path).metadata();
    const stats = await sharp(req.file.path).stats();
    res.json({
      success: true,
      filename: req.file.originalname,
      metadata: {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha,
        colorSpace: metadata.space,
        density: metadata.density,
        orientation: metadata.orientation,
        size_kb: getFileSizeKB(req.file.path),
      },
      stats: {
        channels: stats.channels.map((ch, i) => ({
          channel: i,
          mean: ch.mean.toFixed(2),
          std: ch.std.toFixed(2),
          min: ch.min,
          max: ch.max,
        })),
        isOpaque: stats.isOpaque,
      },
    });
  } catch (err) {
    deleteFile(req.file.path);
    res.status(500).json({ error: "Failed to read metadata", details: err.message });
  }
});

// GET /api/process/download/:filename
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  if (filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({ error: "Invalid filename" });
  }
  const filepath = getProcessedPath(filename);
  res.download(filepath, filename, (err) => {
    if (err) res.status(404).json({ error: "File not found or already deleted" });
  });
});

module.exports = router;
