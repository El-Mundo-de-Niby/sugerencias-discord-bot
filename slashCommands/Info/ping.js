const {SlashCommandBuilder} = require('@discordjs/builders');
module.exports = {
    CMD: new SlashCommandBuilder()
    .setDescription("Sirve para ver el ping del bot"),

    async run(client, interaction,prefix){
        return interaction.reply(`\`${client.ws.ping}ms\``)
    }
}