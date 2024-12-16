const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");

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

module.exports = {
  registerManager,
};