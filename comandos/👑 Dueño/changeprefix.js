const config = require(`${process.cwd()}/botconfig/config.json`);
const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: "changeprefix",
    aliases: ["prefijo", "cambiarprefijo", "cambiarprefix"],
    desc: "Sirve para cambiar el Prefijo del Bot",
    owner: true,
    run: async (client, message, args, prefix, GuildSettings) => {
        if(!args[0]) return message.reply(`❌ **Tienes que especificar el Prefijo del Bot!**`);
        if(args.length > 5) return message.reply(`❌ **El prefijo del bot no puede ser mayor a: \`5 caracteres\`**`)
        config.prefix = args[0]

        fs.writeFile("./botconfig/config.json", JSON.stringify(config), err => {
            if(err) {
                return message.reply(`❌ **No se ha podido cambiar el prefijo del Bot!**`)
            }
        })

        return message.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(`👍 **Cambiado el Prefijo Predeterminado del Bot a \`${args[0]}\`**`).setColor(GuildSettings.embed.color)]})
        
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
