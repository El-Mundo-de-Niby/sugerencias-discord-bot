const path = require('path');
module.exports = {
    apps: [
        {
            name: path.dirname(__filename).split(path.sep).pop(), //dir name
            script: "index.js",
            cron_restart: "0 0 * * *" // at 00:00
        }
    ]
}