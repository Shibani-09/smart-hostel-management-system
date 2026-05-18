const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "in-progress"],
    default: "pending"
  },
  reply: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);