const fs = require("fs").promises;
const path = require("path");

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

module.exports = {
  readManagersFile,
};
