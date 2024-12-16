require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MANAGERS_PATH = path.join(__dirname, "../managers.json");

async function readManagersFile() {
  try {
    const data = await fs.readFile(MANAGERS_PATH, { encoding: "utf8" });
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function writeManagersFile(managers) {
  await fs.writeFile(MANAGERS_PATH, JSON.stringify(managers, null, 2));
}

async function registerManager(req, res) {
  try {
    const { email, password, super: isSuperUser } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const managers = await readManagersFile();

    const existingManager = managers.find((manager) => manager.email === email);
    if (existingManager) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newManager = {
      id: managers.length > 0 ? Math.max(...managers.map((m) => m.id)) + 1 : 1,
      email,
      password: hashedPassword,
      super: isSuperUser !== undefined ? isSuperUser : false,
    };

    managers.push(newManager);

    await writeManagersFile(managers);

    res
      .status(201)
      .json({ status: "Success", message: "Manager Successfully Registered" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function loginManager(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const managers = await readManagersFile();

    const manager = managers.find((m) => m.email === email);

    if (!manager) {
      return res.status(401).json({ error: "Email or Password is Incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, manager.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email or Password is Incorrect" });
    }

    const token = jwt.sign(
      {
        id: manager.id,
        email: manager.email,
        super: manager.super,
      },
      process.env.JWT_SECRET,
      { expiresIn: "20m" }
    );

    res.json({
      token,
      message: "Login successful",
      user: {
        id: manager.id,
        email: manager.email,
        super: manager.super,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = {
  registerManager,
  loginManager,
  authMiddleware,
};
