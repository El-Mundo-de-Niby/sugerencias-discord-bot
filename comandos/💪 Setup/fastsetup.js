var Discord = require(`discord.js`);
module.exports = {
    name: "fastsetup",
    category: "💪 Setup",
    aliases: ["quicksetup", "setupfast", "setupquick"],
    cooldown: 5,
    desc: "Configura el Sistema de Sugerencias con los ajustes por defecto",
    permisos: ["ADMINISTRATOR"],
    permisos_bot: ["SEND_MESSAGES", "MANAGE_MESSAGE"],
    type: "system",
    run: async (client, message, args, prefix, GuildSettings) => {

        message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(`✅ Sistema Configurado`)
                .setDescription(`**Se ha establecido este canal como el canal de sugerencias!**\n\nSi alguien envía un mensaje en este canal, se convertirá en una sugerencia!\n\n*puedes ajustar la configuración usando \`${prefix}setup-suggestions\`*`)
                .setColor(GuildSettings.embed.color)
                .setFooter({text: "Este mensaje será automaticamente eliminado en 10 segundos ..."})
            ]
        }).then((msg) => {
            setTimeout(() => {
                msg.delete();
            }, 10 * 1000);
        })

        client.settings.set(message.guild.id, message.channel.id, "suggestions.channel")

    },
};
  /**
 * @INFO
 * Desarollado por dewstouh#1088 | https://discord.gg/MBPsvcphGf
 * @INFO
 * El Mundo de Niby | https://discord.gg/MBPsvcphGf
 * @INFO
 * Asegúrate de dar creditos si vas a usar este Código
 * @INFO
 */
