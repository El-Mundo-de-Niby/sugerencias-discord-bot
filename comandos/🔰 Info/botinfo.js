const Discord = require("discord.js");
let cpuStat = require("cpu-stat");
const { duration, } = require(`${process.cwd()}/utils/funciones`);
module.exports = {
  name: "botinfo",
  aliases: ["info", "about", "stats"],
  category: "🔰 Info",
  desc: "Envía información detallada del bot",
  usage: "botinfo",
  type: "bot",
  run: async (client, message, args, prefix, GuildSettings) => {
    let es = GuildSettings.embed;

    try {
      let tempmsg = await message.reply({
        embeds: [new Discord.MessageEmbed().setColor(es.color)
          .setAuthor({name: `OBTENIENDO LOS DATOS DEL BOT`, iconURL: "https://cdn.discordapp.com/emojis/756773010123522058.gif", url: "https://discord.gg/MBPsvcphGf"})]
      })
      cpuStat.usagePercent(function (e, percent, seconds) {
        if (e) {
          return console.log(e.stack ? String(e.stack).grey : String(e).grey);
        }
        let connectedchannelsamount = 0;
        let guilds = client.guilds.cache.map((guild) => guild);
        for (let i = 0; i < guilds.length; i++) {
          if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
        }
        const totalGuilds = client.guilds.cache.size;
        const totalMembers = client.users.cache.size;
        countertest = 0;
        const botinfo = new Discord.MessageEmbed()
          .setAuthor({name: client.user.tag + " Información", iconURL: client.user.displayAvatarURL(), url: "https://discord.gg/MBPsvcphGf"})
          .setDescription(`\`\`\`yml\nNombre: ${client.user.tag} [${client.user.id}]\nLatencia del BOT: ${Math.round(Date.now() - message.createdTimestamp)}ms\nLatencia del API: ${Math.round(client.ws.ping)}ms\nTiempo Encendido: ${duration(client.uptime).join(`︲`)}\`\`\``)
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .addField(`${client.allemojis.flechader} General -- Estadísticas`, `\`\`\`yml\nServidores: ${totalGuilds}\nUsuarios: ${totalMembers}\nConexiones: ${connectedchannelsamount}\`\`\``, true)
          .addField(`${client.allemojis.flechader} Bot -- Estadísticas`, `\`\`\`yml\nNode.js: ${process.version}\nDiscord.js: v${Discord.version}\nEnmap: v5.8.4\`\`\``, true)
          .addField(`${client.allemojis.flechader} Sistema -- Estadísticas`, `\`\`\`yml\nOS: Linux | Ubuntu\nUso del CPU: ${percent.toFixed(2)} %\nUso de RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``)
          .addField(`${client.allemojis.flechader} Desarollador`, `\`\`\`yml\nNombre: dewstouh#1088\nID: [282942681980862474]\`\`\``, true)
          .addField(`${client.allemojis.flechader} Links Importantes`, `**[Invítame!](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)・[Servidor de Soporte](https://discord.gg/MBPsvcphGf)・[Página Web](https://dewstouh.github.io/niby)**\n**[Consigue BOTS GRATIS](https://discord.gg/MBPsvcphGf)・[Invitar Versión Pública](https://discord.com/api/oauth2/authorize?client_id=979114923705659402&permissions=8&scope=bot)**`)
          ;
        tempmsg.edit({ embeds: [botinfo] });
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          
          .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
          .setDescription(`\`\`\`${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]
      });
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
