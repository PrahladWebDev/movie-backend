import express from "express";
import upload from "../utils/multerConfig.js"; // Import the existing multer config

const router = express.Router();

// Handle single image upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  try {
    // Respond with Cloudinary image URL
    return res.status(200).json({
      message: "Image uploaded successfully",
      image: req.file.path,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
});

export default router;
