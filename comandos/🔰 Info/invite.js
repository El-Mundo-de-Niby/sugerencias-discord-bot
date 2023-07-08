const {
	MessageEmbed, MessageButton, MessageActionRow
} = require("discord.js")
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
  name: "invite",
  category: "🔰 Info",
  aliases: ["add"],
  usage: "invite",
  desc: "Obtén la invitación de este Bot o de otro",
  type: "bot",
    run: async (client, message, args, prefix, GuildSettings) => {
    
    let es = GuildSettings.embed;
    try {
      let user = message.mentions.users.first() || client.user;
      if(user) {
        if(!user.bot) return interaction?.reply({ephemeral: true, content: `${client.allemojis.no} No puedes obtener la invitación de un Usuario Normal! **TIENE QUE SER UN BOT**`})
        let button_public_invite = new MessageButton().setStyle('LINK').setLabel(`Invitar Bot Público`).setURL("https://discord.com/api/oauth2/authorize?client_id=979114923705659402&permissions=8&scope=bot%20applications.commands")
        let button_support_dc = new MessageButton().setStyle('LINK').setLabel(`Consigue Tu Propio BOT`).setURL(client.configbot.discord)
        let button_invite = new MessageButton().setStyle('LINK').setLabel("Invita a " + user.username).setURL(`https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot%20applications.commands`)
        //array of all buttons
        const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc, button_invite])]
        message.reply({ 
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`Invitar: __**${user.tag}**__`)
            .setDescription(`||[*Haz click aquí para una invitación sin SlashCommands*](https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot)||`)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot%20applications.commands`)
            .setFooter({text: `${user.username} | powered by dewstouh#1088`, iconURL: client.user.displayAvatarURL()})],
          components: allbuttons
        });
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        
        .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
        .setDescription(`\`\`\`${e.message ? e.message : e.stack ? String(e.stack).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
      ]});
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
