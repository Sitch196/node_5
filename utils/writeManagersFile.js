const fs = require("fs").promises;
const path = require("path");

const MANAGERS_PATH = path.join(__dirname, "../managers.json");

async function writeManagersFile(managers) {
  await fs.writeFile(MANAGERS_PATH, JSON.stringify(managers, null, 2));
}

module.exports = {
  writeManagersFile,
};
