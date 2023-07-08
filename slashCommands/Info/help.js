const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow } = require('discord.js');
const Discord = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Sirve para ver la información del bot"),

    async run(client, interaction, prefix, GuildSettings) {
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Ayuda sobre ${client.user.tag}`)
                    .setColor("YELLOW")
                    .setDescription(`El mejor bot de sugerencias, crea, acepta o rechaza ideas sugeridas por los usuarios del servidor!`)
                    .addFields([
                        { name: `✍ Comandos de Información`, value: `>>> *\`/help\`, \`/support\`, \`/ping\`` },
                        { name: `💪 Comandos de Sugerencias`, value: `>>> *\`/setup-suggestions\`, \`/accept\`, \`decline\`*` },
                    ])
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