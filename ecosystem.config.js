const path = require('path');

const splittedPath = path.dirname(__filename).split(path.sep);
const parentFolder = splittedPath[splittedPath.length - 2];
const folderName = splittedPath.pop();
let processName = splittedPath.includes("HostedBots") ? `${parentFolder}_${folderName}` : folderName;
function escapeText(text) {
  return text.replace(/\s+/g, '_');
}

module.exports = {
  apps: [
    {
      name: escapeText(processName),
      script: "index.js",
      cron_restart: "0 0 * * *" // at 00:00
    }
  ],
};
