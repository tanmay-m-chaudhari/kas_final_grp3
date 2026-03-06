const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { ensureDirs } = require("./utils/fileHelper");

ensureDirs();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/process", require("./routes/process"));

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", service: "image-processing-api", timestamp: new Date().toISOString() }));

// API docs root
app.get("/", (_req, res) => {
  res.json({
    service: "Image Processing API",
    version: "1.0.0",
    powered_by: "sharp",
    endpoints: [
      { method: "POST", path: "/api/process/resize", description: "Resize image", params: ["image (file)", "width", "height", "fit", "format", "quality"] },
      { method: "POST", path: "/api/process/crop", description: "Crop image", params: ["image (file)", "left", "top", "width", "height", "format", "quality"] },
      { method: "POST", path: "/api/process/convert", description: "Convert format", params: ["image (file)", "format", "quality"] },
      { method: "POST", path: "/api/process/transform", description: "Rotate/flip/grayscale/blur/sharpen", params: ["image (file)", "rotate", "flip", "flop", "grayscale", "blur", "sharpen", "format", "quality"] },
      { method: "POST", path: "/api/process/info", description: "Get image metadata & stats", params: ["image (file)"] },
      { method: "GET", path: "/api/process/download/:filename", description: "Download processed image" },
    ],
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ error: "File too large. Maximum 20MB." });
  if (err.message?.includes("Unsupported file type")) return res.status(400).json({ error: err.message });
  res.status(500).json({ error: "Internal server error", details: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Image Processing API running on http://localhost:${PORT}`);
  console.log(`📄 API docs: http://localhost:${PORT}/`);
});
