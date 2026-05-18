const express = require("express");
const router = express.Router();

const Notice = require("../models/Notice");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { validateTitle, validateMessage, sanitizeInput } = require("../utils/validation");
const { asyncHandler, sendError, sendSuccess } = require("../utils/errorHandler");

// Create notice (ADMIN/WARDEN)
router.post("/create", authMiddleware, roleMiddleware(["admin", "warden"]), asyncHandler(async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return sendError(res, 400, "Title and message are required");
  }

  if (!validateTitle(title)) {
    return sendError(res, 400, "Title must be at least 3 characters long");
  }

  if (!validateMessage(message)) {
    return sendError(res, 400, "Message must be at least 10 characters long");
  }

  const notice = new Notice({
    title: sanitizeInput(title),
    message: sanitizeInput(message),
    createdBy: req.user.id
  });

  await notice.save();
  await notice.populate("createdBy", "name role");

  sendSuccess(res, 201, "Notice created successfully", { notice });
}));

// Get all notices (AUTHENTICATED)
router.get("/all", authMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const notices = await Notice.find()
    .populate("createdBy", "name role")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Notice.countDocuments();

  sendSuccess(res, 200, "Notices retrieved", {
    notices,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single notice
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id)
    .populate("createdBy", "name role");

  if (!notice) {
    return sendError(res, 404, "Notice not found");
  }

  sendSuccess(res, 200, "Notice retrieved", { notice });
}));

// Update notice (ADMIN/WARDEN - only creator)
router.put("/:id", authMiddleware, roleMiddleware(["admin", "warden"]), asyncHandler(async (req, res) => {
  const { title, message } = req.body;

  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return sendError(res, 404, "Notice not found");
  }

  if (notice.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return sendError(res, 403, "Not authorized to edit this notice");
  }

  if (title && validateTitle(title)) {
    notice.title = sanitizeInput(title);
  }

  if (message && validateMessage(message)) {
    notice.message = sanitizeInput(message);
  }

  notice.updatedAt = new Date();

  await notice.save();
  await notice.populate("createdBy", "name role");

  sendSuccess(res, 200, "Notice updated successfully", { notice });
}));

// Delete notice (ADMIN/WARDEN - creator or admin)
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "warden"]), asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return sendError(res, 404, "Notice not found");
  }

  if (notice.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
    return sendError(res, 403, "Not authorized to delete this notice");
  }

  await Notice.findByIdAndDelete(req.params.id);

  sendSuccess(res, 200, "Notice deleted successfully");
}));

module.exports = router;
