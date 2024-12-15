const fs = require("fs");

const getFilmsData = () => {
  const data = fs.readFileSync("top250.json", "utf8");
  return JSON.parse(data);
};

module.exports = getFilmsData;
