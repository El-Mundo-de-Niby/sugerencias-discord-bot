const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow } = require('discord.js');
const Discord = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Sirve para aceptar una sugerencia")
        .addStringOption(option =>
            option.setName("sugerencia")
                .setDescription("ID de la Sugerencia")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("razon")
                .setDescription("Motivo de rechazo")
                .setRequired(true)
        ),
        memberpermissions: ["ADMINISTRATOR"],

    async run(client, interaction, prefix, GuildSettings) {
        GuildSettings = client.settings.get(interaction.guild.id);
        let id_sug = interaction.options.getString("sugerencia");
        let reason = interaction.options.getString("razon");
        var feedbackchannel = GuildSettings.suggestions.channel;
        let whovotedbtn = new Discord.MessageButton().setStyle('PRIMARY').setEmoji("❓").setLabel("Quien ha votado?").setCustomId("whovoted");

        try {
            var msg = await interaction.guild.channels.cache.get(feedbackchannel).messages.fetch(id_sug);
        } catch {
            return interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`${client.allemojis.no} Esa sugerencia no existe!`)
                    .setColor("RED")
                ]
            });
        }

        let suggestionData = client.suggestions.get(id_sug);
        if (!suggestionData) return interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setTitle(`${client.allemojis.no} Esa sugerencia no existe!`)
                .setColor("RED")
            ]
        });

        msg.embeds[0].color = "RED";
        msg.embeds[0].fields[0].name = `${client.allemojis.flechader} **__Rechazada por ${interaction.user.tag}__**`;
        msg.embeds[0].fields[0].value = `> ${reason}`;
        msg.embeds[0].fields.splice(1, 1)
        msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.MessageActionRow().addComponents([whovotedbtn])] });

        return interaction.reply({
            embeds: [
                new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} **| Sugerencia \`Rechazada\`**`)
                    .setColor("YELLOW")
                    .setDescription(`<#${feedbackchannel}> | [\`ID DE MENSAJE\`](https://discord.com/channels/${interaction.guild.id}/${feedbackchannel}/${id_sug})`)
            ]
            ,ephemeral: true})

    }
}   