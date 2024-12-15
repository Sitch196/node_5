const fs = require("fs");

const saveFilmsData = (films) => {
  fs.writeFileSync("top250.json", JSON.stringify(films, null, 2), "utf8");
};

module.exports = saveFilmsData;
