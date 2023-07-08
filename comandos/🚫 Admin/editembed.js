const {
    MessageEmbed
  } = require("discord.js");
module.exports = {
    name: "editembed",
    category: "🔰 Info",
    desc: "Sirve para editar un mensaje y convertirlo en Embed, con un Título, Descripción e Imagen Personalizado.",
    permisos: ["ADMINISTRATOR"],
    run: async (client, message, args, prefix, GuildSettings) => {

        let es = GuildSettings.embed;
        try {


            if (!args[0])
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setTitle(`${client.allemojis.no} Tienes que especificar la ID del Mensaje del Embed!`)
                        .setDescription(`Uso: \`${prefix}editembed CANAL ++ ID_MENSAJE_EMBED ++ TÍTULO ++ LINK DE IMAGEN ++ DESCRIPCIÓN\``)
                    ]
                });
            let userargs = args.join(" ").split(" ++ ");
            let channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id) || message.guild.channels.cache.get(userargs[0]);
            let oldembedid = userargs[1];
            let title = userargs[2];
            let image = userargs[3];
            let desc = userargs.slice(4).join(" ")
            message.delete().catch(e => console.log("Couldn't delete msg, this is a catch to prevent crash"))
            var ee = "Aquí tienes el Comando, por si lo quieres volver a usar!";
            if (message.content.length > 2000) {
                ee = "Aquí tienes el Comando"
            }
            if (message.content.length > 2020) {
                ee = ""
            }

            if(!channel) return message.reply(`${client.allemojis.no} El canal que has especiificado no existe!`)

            message.channel.messages.fetch(oldembedid).then(msg => {
                msg.edit({
                    embeds: [new MessageEmbed()
                        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                        .setImage(image ? image.includes("http") ? image : message.author.displayAvatarURL : message.author.displayAvatarURL)
                        .setTitle(title ? title.substring(0, 256) : "")
                        .setDescription(desc ? desc.substring(0, 2048) : "")
                    ]
                }).then(d => {
                    var ee = "Aquí tienes el Comando, por si lo quieres volver a usar!";
                    if (message.content.length > 2000) {
                        ee = "Aquí tienes el Comando"
                    }
                    if (message.content.length > 2020) {
                        ee = ""
                    }
                })
            }).catch(e => {
                return message.reply({ content: `${e.message ? String(e.message).substring(0, 1900) : String(e).grey.substring(0, 1900)}`, code: "js" });
            })


        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
                    .setDescription(`\`\`\`${String(e.message).substring(0, 1900)}\`\`\``)
                ]
            });
        }
    }
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
