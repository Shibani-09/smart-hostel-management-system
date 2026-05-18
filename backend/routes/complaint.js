const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint.js");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { validateMessage, sanitizeInput } = require("../utils/validation");
const { asyncHandler, sendError, sendSuccess } = require("../utils/errorHandler");

// Student: Create complaint
router.post("/create", authMiddleware, roleMiddleware(["student"]), asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return sendError(res, 400, "Complaint message is required");
  }

  if (!validateMessage(message)) {
    return sendError(res, 400, "Complaint must be at least 10 characters long");
  }

  const complaint = new Complaint({
    student: req.user.id,
    message: sanitizeInput(message)
  });

  await complaint.save();
  await complaint.populate("student", "name email");

  sendSuccess(res, 201, "Complaint submitted successfully", { complaint });
}));

// Get my complaints (STUDENT)
router.get("/my-complaints", authMiddleware, roleMiddleware(["student"]), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const complaints = await Complaint.find({ student: req.user.id })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Complaint.countDocuments({ student: req.user.id });

  sendSuccess(res, 200, "Your complaints retrieved", {
    complaints,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Admin/Warden: View all complaints
router.get("/all", authMiddleware, roleMiddleware(["warden", "admin"]), asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { status } : {};

  const complaints = await Complaint.find(query)
    .populate("student", "name email role")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Complaint.countDocuments(query);

  sendSuccess(res, 200, "All complaints retrieved", {
    complaints,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single complaint
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate("student", "name email role");

  if (!complaint) {
    return sendError(res, 404, "Complaint not found");
  }

  // Check authorization
  if (complaint.student._id.toString() !== req.user.id && !["warden", "admin"].includes(req.user.role)) {
    return sendError(res, 403, "Not authorized to view this complaint");
  }

  sendSuccess(res, 200, "Complaint retrieved", { complaint });
}));

// Admin/Warden: Update complaint status/reply
router.put("/update/:id", authMiddleware, roleMiddleware(["warden", "admin"]), asyncHandler(async (req, res) => {
  const { status, reply } = req.body;

  if (status && !["pending", "resolved", "in-progress"].includes(status)) {
    return sendError(res, 400, "Invalid status (pending, in-progress, resolved)");
  }

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return sendError(res, 404, "Complaint not found");
  }

  if (status) {
    complaint.status = status;
  }

  if (reply) {
    if (!validateMessage(reply)) {
      return sendError(res, 400, "Reply must be at least 10 characters long");
    }
    complaint.reply = sanitizeInput(reply);
    complaint.resolvedAt = status === "resolved" ? new Date() : complaint.resolvedAt;
  }

  complaint.handledBy = req.user.id;

  await complaint.save();
  await complaint.populate("student", "name email");

  sendSuccess(res, 200, "Complaint updated successfully", { complaint });
}));

// Student: Delete complaint (only if pending)
router.delete("/:id", authMiddleware, roleMiddleware(["student"]), asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return sendError(res, 404, "Complaint not found");
  }

  if (complaint.student.toString() !== userId) {
    return sendError(res, 403, "Not authorized to delete this complaint");
  }

  if (complaint.status !== "pending") {
    return sendError(res, 400, "Can only delete pending complaints");
  }

  await Complaint.findByIdAndDelete(req.params.id);

  sendSuccess(res, 200, "Complaint deleted successfully");
}));

module.exports = router;
