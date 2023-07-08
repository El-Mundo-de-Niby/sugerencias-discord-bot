const {
    MessageEmbed
  } = require("discord.js");
  const {
    duration
  } = require(`${process.cwd()}/utils/funciones`)
  module.exports = {
    name: "uptime",
    category: "🔰 Info",
    aliases: [""],
    usage: "uptime",
    desc: "Muestra el tiempo que lleva encendido el bot",
    type: "bot",
    run: async (client, message, args, prefix, GuildSettings) => {
  
      let es = GuildSettings.embed;
      try {
        let date = new Date()
        let timestamp = date.getTime() - Math.floor(client.uptime);
        let timestamp23 = Math.round(timestamp / 1000)
        message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            
            .setTitle(`${client.allemojis.yes} Tiempo activo de **${client.user.username}**`)
            .setDescription(`\`\`\`css\n${duration(client.uptime).map(i => `${i}`).join("︲")}\`\`\``)
            .addField(`**Fecha de encendido:**`, `<t:${timestamp23}>`)
          ]
        }
        );
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
    }
  }
  /**
   * @INFO
   * Desarollado por dewstouh#1088 | https://discord.gg/MBPsvcphGf
   * @INFO
   * El Mundo de Niby | https://discord.gg/MBPsvcphGf
   * @INFO
   * Asegúrate de dar creditos si vas a usar este Código
   * @INFO
   */
  