const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const { registerUser, loginUser, getUserInfo, logout, changePassword } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// Multer in-memory storage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/getUser/:id", auth, getUserInfo);
router.post("/change-password", auth, changePassword);

// Upload route (protected)
router.post("/upload", auth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send({ message: "No file uploaded" });

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { profileImageUrl: req.file.originalname }, // for serverless
    { new: true }
  );

  res.status(200).send({
    message: "Profile image uploaded",
    profileImageUrl: updatedUser.profileImageUrl,
  });
});

module.exports = router;