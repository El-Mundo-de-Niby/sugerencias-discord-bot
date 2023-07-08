const config = require(`../../botconfig/config.json`);
const Discord = require('discord.js');
const { databasing } = require('../../utils/funciones');
module.exports = async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;
    databasing(client, message.guild.id)

    //use prefix mention
    let GuildSettings = client.settings.get(message.guild.id);

        //LOAD MESSAGE CREATE HANDLERS
        let msgHandlers = [
            'suggestions'
          ];
      
          for (const handler of msgHandlers) {
            try {
              require(`../../handlers/DiscordHandlers/${handler}`).messageCreate(client, message, GuildSettings)
            } catch (e) {
              console.log(`ERRROR CON EL HANDLER ${handler}`)
              console.error(e)
            }
          };

    let { prefix } = GuildSettings;
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)}|${client.user.username.toLowerCase()})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
        if (matchedPrefix.includes(client.user.id))
            return message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(GuildSettings.embed.color)
                    .setTitle(`${client.allemojis.yes} **Para ver Todos mis Comandos usa: \`${prefix}help\`!**`)
                    .setDescription(`>>> *También me puedes usar como prefijo!*\n*Por ejemplo: <@${client.user.id}> \`help\`*`)
                ]
            });
        return;
    }
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;
    if (command.owner || command.owneronly) {
        if (!config.ownerIDS.includes(message.author.id)) return message.reply(`❌ **Solo los dueños de este bot pueden ejecutar este comando!**\n**Dueños del bot:** ${config.ownerIDS.map(ownerid => `<@${ownerid}>`)}`)
    }

    if (command.permisos_bot || command.botpermissions) {
        if (!message.guild.me.permissions.has(command.permisos_bot || command.botpermissions)) return message.reply(`❌ **No tengo suficientes permisos para ejecutar este comando!**\nNecesito los siguientes permisos ${command.permisos_bot || command.botpermissions.map(permiso => `\`${permiso}\``).join(", ")}`)
    }

    if (command.permisos || command.memberpermissions) {
        if (!message.member.permissions.has(command.permisos || command.memberpermissions)) return message.reply(`❌ **No tienes suficientes permisos para ejecutar este comando!**\nNecesitas los siguientes permisos ${(command.permisos || command.memberpermissions).map(permiso => `\`${permiso}\``).join(", ")}`)
    }
    try {
        command.run(client, message, args, GuildSettings.prefix, GuildSettings);
    } catch (e) {
        console.error(e);
        message.channel.send(`❌ Algo ha salido mal a la hora de ejecutar \`${command.name}\``).catch(() => null);
    }

}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
