const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow } = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Sirve para ver los términos de servicios del bot"),

    async run(client, interaction, prefix, GuildSettings) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Términos de Servicio sobre ${client.user.tag}`)
                    .setColor("YELLOW")
                    .setDescription(`Puedes encontrar los términos de servicio de ${client.user.tag} [en este enlace](https://dewstouh.github.io/sugerencias-terms/tos)`)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setColor("YELLOW")
            ],
            components: [
                new MessageActionRow().addComponents([
                    new Discord.MessageButton().setStyle(`LINK`).setURL(`${client.configbot.discord}`).setEmoji("🤖").setLabel("Servidor de Soporte"),
                    new Discord.MessageButton().setStyle(`LINK`).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`).setEmoji(client.allemojis.niby).setLabel("Invita el Bot"),
                ])
            ]
        })
    }
}