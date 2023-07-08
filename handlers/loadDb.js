const Enmap = require('enmap');
module.exports = client => {
    client.settings = new Enmap({
        name: "settings",
        dataDir: "./databases/settings"
    });

    client.suggestions = new Enmap({
        name: "suggestions",
        dataDir: "./databases/suggestions"
    })
}