const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const GatePass = require("../models/GatePass");
const Complaint = require("../models/Complaint");
const Notice = require("../models/Notice");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { validateEmail, validateName, validatePassword, sanitizeInput } = require("../utils/validation");
const { asyncHandler, sendError, sendSuccess } = require("../utils/errorHandler");

// Get all users (ADMIN)
router.get("/users", authMiddleware, roleMiddleware(["admin"]), asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;
  const query = role ? { role } : {};

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  sendSuccess(res, 200, "Users retrieved", {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single user (ADMIN)
router.get("/users/:id", authMiddleware, roleMiddleware(["admin"]), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  sendSuccess(res, 200, "User retrieved", { user });
}));

// Create admin/warden account (ADMIN)
router.post("/users", authMiddleware, roleMiddleware(["admin"]), asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return sendError(res, 400, "Name, email, password, and role are required");
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

  if (!["admin", "warden", "student"].includes(role)) {
    return sendError(res, 400, "Invalid role");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return sendError(res, 409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    name: sanitizeInput(name),
    email: email.toLowerCase(),
    password: hashedPassword,
    role
  });

  await user.save();

  sendSuccess(res, 201, "User created successfully", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
}));

// Update user (ADMIN)
router.put("/users/:id", authMiddleware, roleMiddleware(["admin"]), asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  const user = await User.findById(req.params.id);

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

  if (role && ["admin", "warden", "student"].includes(role)) {
    user.role = role;
  }

  await user.save();

  sendSuccess(res, 200, "User updated successfully", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
}));

// Delete user (ADMIN)
router.delete("/users/:id", authMiddleware, roleMiddleware(["admin"]), asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (userId === req.user.id) {
    return sendError(res, 400, "Cannot delete your own account");
  }

  const user = await User.findById(userId);

  if (!user) {
    return sendError(res, 404, "User not found");
  }

  // Delete related data
  await GatePass.deleteMany({ student: userId });
  await Complaint.deleteMany({ student: userId });

  // Remove user from createdBy in notices
  await Notice.updateMany(
    { createdBy: userId },
    { $unset: { createdBy: 1 } }
  );

  await User.findByIdAndDelete(userId);

  sendSuccess(res, 200, "User deleted successfully");
}));

// Get system statistics (ADMIN)
router.get("/stats", authMiddleware, roleMiddleware(["admin"]), asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalWardens = await User.countDocuments({ role: "warden" });
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalUsers = await User.countDocuments();

  const totalGatePasses = await GatePass.countDocuments();
  const pendingGatePasses = await GatePass.countDocuments({ status: "pending" });
  const approvedGatePasses = await GatePass.countDocuments({ status: "approved" });
  const rejectedGatePasses = await GatePass.countDocuments({ status: "rejected" });

  const totalComplaints = await Complaint.countDocuments();
  const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
  const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" });

  const totalNotices = await Notice.countDocuments();

  sendSuccess(res, 200, "System statistics retrieved", {
    users: {
      total: totalUsers,
      students: totalStudents,
      wardens: totalWardens,
      admins: totalAdmins
    },
    gatePasses: {
      total: totalGatePasses,
      pending: pendingGatePasses,
      approved: approvedGatePasses,
      rejected: rejectedGatePasses
    },
    complaints: {
      total: totalComplaints,
      pending: pendingComplaints,
      resolved: resolvedComplaints
    },
    notices: totalNotices
  });
}));

module.exports = router;
