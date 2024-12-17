require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readManagersFile } = require("../utils/readManagersFile");
const { writeManagersFile } = require("../utils/writeManagersFile");

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

module.exports = {
  registerManager,
  loginManager,
};
