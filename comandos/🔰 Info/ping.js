module.exports = {
    name: "ping",
    aliases: ["latencia", "ms"],
    desc: "Sirve para ver la latencia del Bot",
    run: async (client, message, args, prefix, GuildSettings) => {
        message.reply(`🏓 **Pong! El Ping del Bot es de \`${client.ws.ping}ms\`**`)
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
