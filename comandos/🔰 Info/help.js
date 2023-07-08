const { readdirSync } = require('fs');
const {paginacion2, duration} = require('../../utils/funciones')
const Discord = require('discord.js');
module.exports = {
    name: "help",
    aliases: ["h", "ayuda", "bothelp"],
    desc: "Sirve para ver la información del Bot",
    run: async (client, message, args, prefix, GuildSettings) => {
        let embeds = [new Discord.MessageEmbed()
            .setColor(GuildSettings.embed.color)
            .setFooter({text: "Vista General\n" + client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTitle(`Información sobre __${client.user.username}__`)
            .addField(`🔥 **__Mis Características__**`, `>>> 😎 El Más **Configurable & Sencillo** 💡 **__Sistema de Sugerencias__**\n🤯 Distintos **modos** de sugerencias!\n🥶 **Envía sugerencias en un canal o por comando!**\n✅ **Súper Fácil de Utilizar**`)
            .addField(":question: **__Como funciono?__**",
                `>>> \`${prefix}tutorial\` **Para ver un tutorial del Bot!**\n\`${prefix}setup-suggestion\` **Para configurar el Sistema de Sugerencias!**\n*también puedes avanzar de página para ver el resto de comandos!*`)
            .addField(":chart_with_upwards_trend: **__ESTADÍSTICAS:__**",
                `>>> :gear: **${client.commands.size} Comandos**
:file_folder: en **${client.guilds.cache.size} Servidores**
⌚️ **${duration(client.uptime).map(i => `\`${i}\``).join("︲")} Tiempo Activo**
📶 **\`${Math.floor(client.ws.ping)}ms\` Ping**
${client.allemojis.dewstouh} Creado por **[dewstouh#1088](https://discord.gg/MBPsvcphGf)**`)
.setImage("https://i.imgur.com/bsjakDe.gif")


        ];
        const categorias = readdirSync('./comandos');
        categorias.map((categoria, index) => {
            const comandosCategoria = readdirSync(`./comandos/${categoria}`).filter(archivo => archivo.endsWith('.js')).map(cmd => client.commands.find(comando => comando.name === cmd.replace('.js', "")));
            let embed = new Discord.MessageEmbed()
            .setTitle(`${categoria.split(" ")[0]} **__${categoria.split(" ")[1]}__** - Comandos`)
            .addFields(comandosCategoria.map(cmd => {
                return {
                    name: `\`${prefix}${cmd.name}\``,
                    value: `> *${cmd.desc}*`,
                    inline: true
                }
            }))
            .setColor(GuildSettings.embed.color)
            .setFooter({text: `Página ${index + 1} de ${categorias.length}`})
            .setImage("https://i.imgur.com/bsjakDe.gif")

            embeds.push(embed)
        })
        return paginacion2(client, message, embeds);
        
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
