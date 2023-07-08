const embed = require(`${process.cwd()}/botconfig/embed.json`);
const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: "changecolor",
    aliases: ["prefijo", "cambiarprefijo", "cambiarprefix"],
    desc: "Sirve para cambiar el Preijo del Bot",
    owner: true,
    run: async (client, message, args, prefix, GuildSettings) => {
        if(!args[0]) return message.reply(`❌ **Tienes que especificar el Color del Bot!**`);
        if(!args[0].startsWith("#") || args[0].length != 7) return message.reply(`❌ **Tienes que especificar un color HEX válido!\nEjemplo: \`${embed.color}\`**`)
        GuildSettings.embed.color = args[0]
        fs.writeFile("./botconfig/embed.json", JSON.stringify(embed), err => {
            if(err) {
                return message.reply(`❌ **No se ha podido cambiar el prefijo del Bot!**`)
            }
        })
        return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(`👍 **Cambiado el Color Predeterminado del Bot a \`${args[0]}\`**`).setColor(GuildSettings.embed.color)]})
        
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
