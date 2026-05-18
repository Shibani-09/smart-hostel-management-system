const express = require("express");
const router = express.Router();

const GatePass = require("../models/GatePass");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { validateReason, validateDate, validateTime, sanitizeInput } = require("../utils/validation");
const { asyncHandler, sendError, sendSuccess } = require("../utils/errorHandler");

// Test route
router.get("/test", (req, res) => {
  sendSuccess(res, 200, "Gatepass route working");
});

// Create gate pass (STUDENT)
router.post("/request", authMiddleware, roleMiddleware(["student"]), asyncHandler(async (req, res) => {
  const { reason, date, time } = req.body;

  if (!reason || !date || !time) {
    return sendError(res, 400, "Reason, date, and time are required");
  }

  if (!validateReason(reason)) {
    return sendError(res, 400, "Reason must be at least 5 characters long");
  }

  if (!validateDate(date)) {
    return sendError(res, 400, "Date must be in the future");
  }

  if (!validateTime(time)) {
    return sendError(res, 400, "Invalid time format (HH:MM)");
  }

  const gatePass = new GatePass({
    student: req.user.id,
    reason: sanitizeInput(reason),
    date,
    time
  });

  await gatePass.save();
  await gatePass.populate("student", "name email");

  sendSuccess(res, 201, "Gate pass requested successfully", { gatePass });
}));

// Get all gate passes (WARDEN/ADMIN)
router.get("/all", authMiddleware, roleMiddleware(["warden", "admin"]), asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { status } : {};
  
  const passes = await GatePass.find(query)
    .populate("student", "name email role")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await GatePass.countDocuments(query);

  sendSuccess(res, 200, "Gate passes retrieved", {
    passes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get my gate passes (STUDENT)
router.get("/my-passes", authMiddleware, roleMiddleware(["student"]), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const passes = await GatePass.find({ student: req.user.id })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await GatePass.countDocuments({ student: req.user.id });

  sendSuccess(res, 200, "Your gate passes retrieved", {
    passes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single gate pass
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const pass = await GatePass.findById(req.params.id).populate("student", "name email role");

  if (!pass) {
    return sendError(res, 404, "Gate pass not found");
  }

  // Check authorization
  if (pass.student._id.toString() !== req.user.id && !["warden", "admin"].includes(req.user.role)) {
    return sendError(res, 403, "Not authorized to view this gate pass");
  }

  sendSuccess(res, 200, "Gate pass retrieved", { pass });
}));

// Update gate pass status (WARDEN/ADMIN)
router.put("/update/:id", authMiddleware, roleMiddleware(["warden", "admin"]), asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return sendError(res, 400, "Valid status required (pending, approved, rejected)");
  }

  const gatePass = await GatePass.findById(req.params.id);

  if (!gatePass) {
    return sendError(res, 404, "Gate pass not found");
  }

  gatePass.status = status;
  if (remarks) {
    gatePass.remarks = sanitizeInput(remarks);
  }
  gatePass.approvedBy = req.user.id;
  gatePass.approvedAt = new Date();

  await gatePass.save();
  await gatePass.populate("student", "name email");

  sendSuccess(res, 200, "Gate pass updated successfully", { gatePass });
}));

// Edit gate pass (STUDENT - only if pending)
router.put("/:id", authMiddleware, roleMiddleware(["student"]), asyncHandler(async (req, res) => {
  const { reason, date, time } = req.body;
  const userId = req.user.id;

  const gatePass = await GatePass.findById(req.params.id);

  if (!gatePass) {
    return sendError(res, 404, "Gate pass not found");
  }

  if (gatePass.student.toString() !== userId) {
    return sendError(res, 403, "Not authorized to edit this gate pass");
  }

  if (gatePass.status !== "pending") {
    return sendError(res, 400, "Can only edit pending gate passes");
  }

  if (reason && validateReason(reason)) {
    gatePass.reason = sanitizeInput(reason);
  }

  if (date && validateDate(date)) {
    gatePass.date = date;
  }

  if (time && validateTime(time)) {
    gatePass.time = time;
  }

  await gatePass.save();
  await gatePass.populate("student", "name email");

  sendSuccess(res, 200, "Gate pass updated successfully", { gatePass });
}));

// Delete gate pass (STUDENT - only if pending)
router.delete("/:id", authMiddleware, roleMiddleware(["student"]), asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const gatePass = await GatePass.findById(req.params.id);

  if (!gatePass) {
    return sendError(res, 404, "Gate pass not found");
  }

  if (gatePass.student.toString() !== userId) {
    return sendError(res, 403, "Not authorized to delete this gate pass");
  }

  if (gatePass.status !== "pending") {
    return sendError(res, 400, "Can only delete pending gate passes");
  }

  await GatePass.findByIdAndDelete(req.params.id);

  sendSuccess(res, 200, "Gate pass deleted successfully");
}));

module.exports = router;
