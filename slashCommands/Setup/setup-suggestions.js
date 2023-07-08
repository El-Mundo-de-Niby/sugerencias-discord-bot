const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow } = require('discord.js');
const Discord = require('discord.js');
module.exports = {
    CMD: new SlashCommandBuilder()
        .setDescription("Sirve para establecer el canal de sugerencias")
        .addChannelOption(option => 
            option.setName("canal")
            .setDescription("Canal de Sugerencias")
            .addChannelTypes(0)
            .setRequired(true)
            ),
            memberpermissions: ["ADMINISTRATOR"],

    async run(client, interaction, prefix, GuildSettings) {
        let channel = interaction.options.getChannel("canal");
        
        client.settings.set(interaction.guild.id, channel.id, "suggestions.channel");

        return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`${client.allemojis.yes} Canal de sugerencias establecido a ${channel.name}`)
                    .setColor("GREEN")
                    .setDescription(`Todos los mensajes enviados en ${channel} serán reemplazados por sugerencias.`)
            ],  
        })
    }
}