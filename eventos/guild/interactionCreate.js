const Discord = require("discord.js");
const { databasing } = require("../../utils/funciones");
module.exports = async (client, interaction) => {

    //interaction command handler
    if (!interaction?.isCommand()) {
        if (!interaction.guild || interaction.guild.available === false) return;
        databasing(client, interaction.guild.id);
        let GuildSettings = client.settings.get(interaction.guild.id);
        let interactionHandlers = [
            'suggestions'
        ]

        for (const handler of interactionHandlers) {
            try {
                require(`../../handlers/DiscordHandlers/${handler}`).interactionCreate(client, interaction, GuildSettings)
            } catch (e) {
                console.log(`ERROR WITH HANDLER: ${handler}`)
                console.log(e)
            }
        }
    }
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply({ content: "❌ Ha ocurrido un error." }).catch(() => null);
        databasing(client, interaction.guild.id)
        let GuildSettings = client.settings.get(interaction.guild.id);
        if (cmd.memberpermissions && cmd.memberpermissions.length > 0 && !interaction?.member.permissions.has(cmd.memberpermissions)) {
            return interaction?.reply({
                ephemeral: true,
                embeds: [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)

                    .setTitle(`${client.allemojis.no} No tienes suficientes permisos para ejecutar este comando!`)
                    .setDescription(`Necesitas los siguientes permisos:\n> \`${command.memberpermissions.join("`, ``")}\``)
                ]
            });
        }

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id) || await interaction.guild.members.fetch(interaction.user.id).catch(() => null)

        cmd.run(client, interaction, args, "/", GuildSettings);
    }

}
