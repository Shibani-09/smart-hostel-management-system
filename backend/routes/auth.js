const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { validateEmail, validatePassword, validateName, sanitizeInput } = require("../utils/validation");
const { asyncHandler, sendError, sendSuccess } = require("../utils/errorHandler");

const JWT_SECRET = process.env.JWT_SECRET || "hostel_management_secret";

// ================= TEST ROUTE =================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route working"
  });
});


// ================= REGISTER =================
router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return sendError(res, 400, "Name, email, and password are required");
  }

  if (!validateName(name)) {
    return sendError(res, 400, "Name must be at least 2 characters long");
  }

  if (!validateEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  if (!validatePassword(password)) {
    return sendError(res, 400, "Password must be at least 6 characters long");
  }

  // Check existing user
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return sendError(res, 409, "Email already registered");
  }

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = new User({
    name: sanitizeInput(name),
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role && ["student", "warden", "admin"].includes(role) ? role : "student"
  });

  await user.save();

  sendSuccess(res, 201, "User registered successfully", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
}));


// ================= LOGIN =================
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  if (!validateEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return sendError(res, 401, "Invalid email or password");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendError(res, 401, "Invalid email or password");
  }

  // Generate JWT token
  if (!JWT_SECRET) return sendError(res, 500, "Server JWT_SECRET not configured");

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  sendSuccess(res, 200, "Login successful", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));


// ================= PROFILE (PROTECTED) =================
router.get("/profile", authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  sendSuccess(res, 200, "Profile retrieved", { user });
}));

// ================= UPDATE PROFILE (PROTECTED) =================
router.put("/profile", authMiddleware, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return sendError(res, 404, "User not found");
  }

  if (name && validateName(name)) {
    user.name = sanitizeInput(name);
  }

  if (email && email !== user.email) {
    if (!validateEmail(email)) {
      return sendError(res, 400, "Invalid email format");
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 409, "Email already in use");
    }
    user.email = email.toLowerCase();
  }

  await user.save();

  sendSuccess(res, 200, "Profile updated successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

// ================= CHANGE PASSWORD (PROTECTED) =================
router.post("/change-password", authMiddleware, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return sendError(res, 400, "All password fields are required");
  }

  if (newPassword !== confirmPassword) {
    return sendError(res, 400, "Passwords do not match");
  }

  if (!validatePassword(newPassword)) {
    return sendError(res, 400, "Password must be at least 6 characters long");
  }

  const user = await User.findById(userId);
  if (!user) {
    return sendError(res, 404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return sendError(res, 401, "Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  sendSuccess(res, 200, "Password changed successfully");
}));


module.exports = router;