const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow } = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Sirve para recibir soporte del bot"),

    async run(client, interaction, prefix, GuildSettings) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`❓ Soporte de __${client.user.tag}__`)
                    .setColor("YELLOW")
                    .addField(`👤 Usuario de Contacto`, `>>> \`dewstouh#1088\``)
                    .setDescription(`Tienes algunas preguntas relacionadas con el Bot? Quieres solicitar un borrado de datos? Mira nuestro servidor de soporte!`)
                    .addField(`📨 Correo de Contacto`, `>>> \`contactoniby@gmail.com\``)
                    .addField(`🟢 Servidor de Soporte`, `>>> \`discord.gg/niby\``)
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