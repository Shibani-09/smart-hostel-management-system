const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Token missing" });

    const secret = process.env.JWT_SECRET || "hostel_management_secret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authMiddleware;