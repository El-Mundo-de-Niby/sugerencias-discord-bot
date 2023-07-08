const {
	MessageEmbed
} = require("discord.js")
const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
	name: "developer",
	category: "🔰 Info",
	aliases: ["desarollador"],
	desc: "Muestra información del desarollador del Bot",
	usage: "developer",
	type: "bot",
	run: async (client, message, args, prefix, GuildSettings) => {
		let es = GuildSettings.embed;

		try {
			let button_public_invite = new MessageButton().setStyle('LINK').setLabel(`Invitar Versión Pública!`).setURL("https://discord.com/api/oauth2/authorize?client_id=979114923705659402&permissions=8&scope=bot%20applications.commands")
			let button_support_dc = new MessageButton().setStyle('LINK').setLabel(`Consigue tu propio BOT!`).setURL("https://discord.gg/MBPsvcphGf")
			let button_invite = new MessageButton().setStyle('LINK').setLabel("Servidor de Soporte").setEmoji(client.allemojis.dewstouh).setURL(client.configbot.discord)
			const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc, button_invite])]
			message.reply({
				embeds: [new MessageEmbed()
					.setColor(es.color)
					
					.setTimestamp()
					.setThumbnail("https://i.imgur.com/9bIUF4n.png")
					.setTitle("dewstouh#1088 - Desarollador de Bots")
					.setURL(client.configbot.discord)
					.setDescription("> Hola, mi nombre es **dewstouh** _`dewstouh#1088`_ y soy un Desarollador de Bots!\n\n> He creado más de **__100+ Bots de Discord__** y estoy muy orgulloso de cada uno de ellos!\n\n> De hecho, **he creado este Bot** y tú puedes conseguir uno propio para ti **GRATIS** [`Uniendote a mi Discord!`](https://discord.gg/MBPsvcphGfw)\n\n*Si tienes preguntas o necesitas ayuda, mis DMS están abiertos!*")],
				components: allbuttons
			}).catch(error => console.log(error));
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
