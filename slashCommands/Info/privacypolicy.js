const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow } = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Sirve para ver la Política de Privacidad del bot"),

    async run(client, interaction, prefix, GuildSettings) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Política de Privacidad sobre ${client.user.tag}`)
                    .setColor("YELLOW")
                    .setDescription(`Puedes encontrar la Política de Privacidad de ${client.user.tag} [en este enlace](https://dewstouh.github.io/sugerencias-terms/privacy-policy)`)
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