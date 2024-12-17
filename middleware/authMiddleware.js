require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");
const { readManagersFile } = require("../utils/readManagersFile");

const authMiddleware = async (req, res, next) => {
  if (req.path.startsWith("/api/auth/")) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token must be in Bearer format" });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const managers = await readManagersFile();
    const user = managers.find((m) => m.id === decoded.id);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token has expired" });
    }
    return res.status(403).json({ error: "Invalid Token" });
  }
};

module.exports = { authMiddleware };
