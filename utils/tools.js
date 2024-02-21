function readJson(path) {
  const fs = require("fs");
  const data = JSON.parse(fs.readFileSync(path));
  return data;
}

module.exports = { readJson };
