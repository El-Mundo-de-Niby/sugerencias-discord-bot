const {
    MessageEmbed,
  } = require(`discord.js`);
  module.exports = {
    name: `deployslash`,
    type: "info",
    aliases: [`deployslash`, "deploy", "loadslash", "deployslashcommands", "deployslashcmds", "loadslashcommands", "loadslashcmds"],
    desc: `Carga los SLASH COMMANDS para TODOS LOS SERVIDORES o para SOLO UNO EN CONCRETO`,
    usage: `deployslash [GUILDID]`,
    cooldown: 360,
    run: async (client, message, args, prefix, GuildSettings) => {
      if (message.author.id != "282942681980862474")
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor(GuildSettings.embed.wrongcolor)
            .setFooter(client.user.username, GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL())
            .setTitle("Solo \`dewstouh#1088\` puede desplegar los SLASH-COMMANDS")
            .setDescription(`Ve al [Discord de Soporte](https://discord.gg/MBPsvcphGf), abre un Ticket y pídelo!`)
          ]
        });
      try {
        let loadSlashsGlobal = true;
        let guildId = args[0];
        if(guildId){
          let guild = client.guilds.cache.get(guildId);
          if(guild){
            loadSlashsGlobal = false;
            guildId = guild.id;
          }
        }
        if(loadSlashsGlobal){
          let themsg = await message.reply(`${client.allemojis.loading} **Intentando cargar los Slash Commands en \`${client.guilds.cache.size} Servidores\`...**`)
          client.application.commands.set(client.allCommands)
            .then(slashCommandsData => {
              themsg.edit(`**\`${slashCommandsData.size} Slash-Commands\`** (\`${slashCommandsData.map(d => d.options).flat().length} Subcomandos\`) cargados para todos los **Servidores posibles**\n> Esos servidores, son aquellos, con los que me hayan invitado con los pemisos de SLASH-COMMANDS!\n> *Como estas usando los ajustes globales, puede tardar hasta 1 hora!*`); 
            }).catch(() => {});
        } else {
          let guild = client.guilds.cache.get(guildId);
          let themsg = await message.reply(`${client.allemojis.loading} **Intentando cargar los comandos en el Servidor \`${guild.name}\`...**`)
          await guild.commands.set(client.allCommands).then((slashCommandsData) => {
            themsg.edit(`**\`${slashCommandsData.size} Slash-Commands\`** (\`${slashCommandsData.map(d => d.options).flat().length} Subcomandos\`) cargados para **${guild.name}**\n> Esos servidores, son aquellos, con los que me hayan invitado con los pemisos de SLASH-COMMANDS!\n> *Como estas usando los ajustes globales, puede tardar hasta 1 hora!*`); 
          }).catch((e) => {
            console.log(e)
            themsg.edit(`**No se ha podido cargar los slash commands en ${guild.name}**\n\n**Me has invitado con este Link?**\n> $https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot%20applications.commands`)
          });
        }
      } catch (e) {
        console.log(String(e.stack).dim.bgRed)
        return message.channel.send({embeds : [new MessageEmbed()
          .setColor(GuildSettings.embed.wrongcolor)
          
          .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
          .setDescription(`\`\`\`${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]});
      }
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
  