const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "prefix",
    aliases: ["latencia", "ms"],
    desc: "Sirve para cambiar el prefijo del Bot en el Servidor",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, prefix, GuildSettings) => {

        try {

            //if no args return error
            if (!args[0])
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(GuildSettings.embed.wrongcolor)
                        .setTitle(`${client.allemojis.no} Tienes que especificar el nuevo prefijo!`)
                        .setDescription(`**El Prefijo Actual es: \`${GuildSettings.prefix}\`**`)
                    ]
                });
            //if there are multiple arguments
            if (args[1])
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(GuildSettings.embed.wrongcolor)
                        .setTitle(`${client.allemojis.no} Solo puedes especificar un nuevo prefijo!`)
                    ]
                });
            //if the prefix is too long
            if (args[0].length > 5)
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(GuildSettings.embed.wrongcolor)
                        .setTitle(`${client.allemojis.no} El prefijo no puede tener más de 5 caracteres!`)
                    ]
                });
            //set the new prefix
            client.settings.set(message.guild.id, args[0], `prefix`);
            //return success embed
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                    
                    .setTitle(`${client.allemojis.yes} El prefijo ha sido cambiado a \`${args[0]}\``)
                ]
            });
        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(GuildSettings.embed.wrongcolor)
                    .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
                    .setDescription(`\`\`\`${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
                ]
            });
        }
    }
};
/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
