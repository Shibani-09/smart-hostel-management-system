require("dotenv").config();

process.env.JWT_SECRET = process.env.JWT_SECRET || "hostel_management_secret";
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const auth = require("./routes/auth");
const gatepass = require("./routes/gatepass");
const notice = require("./routes/notice");
const complaint = require("./routes/complaint");
const admin = require("./routes/admin");

// Mount routes
app.use("/api/auth", auth);
app.use("/api/gatepass", gatepass);
app.use("/api/notices", notice);
app.use("/api/complaints", complaint);
app.use("/api/admin", admin);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server working" });
});

// DB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hostelDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB Error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// Start server
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

startServer(DEFAULT_PORT);