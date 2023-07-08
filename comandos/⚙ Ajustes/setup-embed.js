var {
    MessageEmbed
  } = require(`discord.js`);
  var Discord = require(`discord.js`);
  const { MessageButton, MessageActionRow } = require('discord.js')
  module.exports = {
    name: "setup-embed",
    category: "💪 Setup",
    aliases: ["setupembed", "embed-setup", "embedsetup"],
    cooldown: 5,
    usage: "setup-embed  -->  Sigue los pasos",
    desc: "Cambia el estilo de los Embeds (Color, Imagen, Miniatura, ...) en el Servidor",
    memberpermissions: ["ADMINISTRATOR"],
    type: "info",
    run: async (client, message, args, prefix, GuildSettings) => {
      let cmduser = message.author;
      let es = GuildSettings.embed;
      try {
          var timeouterror = false;
          let row = new MessageActionRow()
          .addComponents(
            new MessageButton().setStyle("SECONDARY").setCustomId("1").setEmoji("1️⃣"),
            new MessageButton().setStyle("SECONDARY").setCustomId("2").setEmoji("2️⃣"),
            new MessageButton().setStyle("SECONDARY").setCustomId("3").setEmoji("3️⃣"),
            new MessageButton().setStyle("SECONDARY").setCustomId("4").setEmoji("4️⃣"),
          )
          var tempmsg = await message.reply({components: [row], embeds: [new Discord.MessageEmbed()
            .setTitle(`Elige una opción`)
            .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
            .setDescription(`1️⃣ **==** Cambiar el **Color** de los Embeds\n\n2️⃣ **==** Cambiar la **Imagen** de los Embeds\n\n3️⃣ **==** Cambiar el **Texto Pie** de los Embeds\n\n4️⃣ **==** ${GuildSettings.embed.thumb ? "**Desactivar** la Miniatura de los Embeds" : "**Activar** la Miniatura de los Embeds"}\n\n\n\n*Reacciona con el Emoji adecuado para la opción*`)
          ]})
          //Create the collector
          const collector = tempmsg.createMessageComponentCollector({ 
            filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
            time: 90000
          })
          //Menu Collections
          collector.on('collect', async button => {
            if (button?.user.id === cmduser.id) {
              collector.stop();
              button?.deferUpdate();
              if (button?.customId == "1") {
                let discordsupportedcolors = [
                  'DEFAULT',            'WHITE',
                  'AQUA',               'GREEN',
                  'BLUE',               'YELLOW',
                  'PURPLE',             'LUMINOUS_VIVID_PINK',
                  'FUCHSIA',            'GOLD',
                  'ORANGE',             'RED',
                  'GREY',               'NAVY',
                  'DARK_AQUA',          'DARK_GREEN',
                  'DARK_BLUE',          'DARK_PURPLE',
                  'DARK_VIVID_PINK',    'DARK_GOLD',
                  'DARK_ORANGE',        'DARK_RED',
                  'DARK_GREY',          'DARKER_GREY',
                  'LIGHT_GREY',         'DARK_NAVY',
                  'BLURPLE',            'GREYPLE',
                  'DARK_BUT_NOT_BLACK', 'NOT_QUITE_BLACK',
                  'RANDOM'
                ]
                
                tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Qué color quieres?`)
                  .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                  .addField(`**Colores Disponibles:**`, `>>> **HTML/Hex-Colors** (\`#ffff00\`)\n\nNombre de Colores/Colores de Discord (\`FUCHSIA\`)\n\nNotación HEX (\`0xffffff\`)`)
                  .addField(`**Colores de Discord:**`, `>>> ${discordsupportedcolors.map(c => `\`${c}\``).join("︲")}`)
                  .addField(`**Color Actual:**`, `>>> \`${GuildSettings.embed.color}\``)
                  ]
                })
                await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(collected => {
                    var color = collected.first().content;
                    if (!color) {
                      message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(`${client.allemojis.no} No has añadido un color válido!`)
                      .setColor(GuildSettings.embed.wrongcolor)
                      .setDescription(`Tiene que ser un color HEX, por ejemplo: \`#ffee22\``)
                      
                    ]});
                    
                    return;
                  }
                    try {
                      const { Util: { resolveColor } } = require("discord.js");
                      try {
                        color = color.toUpperCase(); //convert it to uppercase, (cleaner)
                        let newcolor = false;
                        newcolor = resolveColor(color);
                        if(!newcolor) {
                          message.reply("Color inválido, fíjate en los ejemplos!");
                          
                          return;
                        }
                      }catch (e){
                        return message.reply({embeds: [new MessageEmbed().setColor("RED").setTitle(":x: COLOR INVÁLIDO").setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)]})
                      }
                      client.settings.set(message.guild.id, color ,"embed.color")
                      message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`${client.allemojis.yes} Cambiado el color a ${color}`)
                        .setColor(color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                        
                      ]});
                      
                      return;
                    } catch (e) {
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`${client.allemojis.no} No he podido cambiar el color!`)
                        .setColor(GuildSettings.embed.wrongcolor)
                        .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
                        
                      ]});
                    }
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`${client.allemojis.no} Tu tiempo ha expirado!`)
                    .setColor(GuildSettings.embed.wrongcolor)
                    .setDescription(`Setup cancelado!`.substring(0, 2000))
                    
                  ]});
        
              } else if (button?.customId == "2") {
                tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Que imagen quieres usar?`)
                  .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                  .setDescription(`Recuerda que, si introduces una URL de la Imagen, y esa URL desaparece o deja de funcionar, la imagen también lo hará!`)
                  ]
                })
                await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(collected => {
                    var url = collected.first().content;
                    function attachIsImage(msgAttach) {
                      url = msgAttach.url;
                      //True if this url is a png image.
                      return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 ||
                        url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 ||
                        url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
                      }
  
                    if (collected.first().attachments.size > 0) {
                      if (collected.first().attachments.every(attachIsImage)) {
                        try {
                          client.settings.set(message.guild.id, url ,"embed.footericon")
                          es = {
                            color: GuildSettings.embed.color,
                            thumb: GuildSettings.embed.thumb,
                            wrongcolor: GuildSettings.embed.wrongcolor,
                            footertext: GuildSettings.embed.footertext,
                            footericon: url
                          }
                          message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`${client.allemojis.yes} Cambiada la IMAGEN del Embed!`)
                            .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                            
                          ]});
                          
                          return;
                        } catch (e) {
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
                            .setColor(GuildSettings.embed.wrongcolor)
                            .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
                            
                          ]});
                        }
                      } else {
                        message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`${client.allemojis.no} No has añadido una Imagen Válida!`)
                          .setColor(GuildSettings.embed.wrongcolor)
                          
                        ]});
                        
                        return;
                      }
                      } else if (!url.includes("http") || !(url.toLowerCase().includes("png")||url.toLowerCase().includes("gif")||url.toLowerCase().includes("jpg"))){
                        message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle(`${client.allemojis.no} No has añadido una Imagen Válida!`)
                          .setColor(GuildSettings.embed.wrongcolor)
                          
                        ]});
                        
                        return;
                      } else {
                        try {
                          client.settings.set(message.guild.id, url ,"embed.footericon")
                          es = {
                            color: GuildSettings.embed.color,
                            thumb: GuildSettings.embed.thumb,
                            wrongcolor: GuildSettings.embed.wrongcolor,
                            footertext: GuildSettings.embed.footertext,
                            footericon: url
                          }
                          message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`${client.allemojis.yes} Cambiada la IMAGEN del Embed!`)
                            .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                            
                          ]});
                          
                          return;
                        } catch (e) {
                          return message.reply({embeds: [new Discord.MessageEmbed()
                            .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
                            .setColor(GuildSettings.embed.wrongcolor)
                            .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
                            
                          ]});
                        }
                      }
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Tu tiempo ha expirado!`)
                    .setColor(GuildSettings.embed.wrongcolor)
                    .setDescription(`Setup cancelado!`.substring(0, 2000))
                    
                  ]});
              } else if (button?.customId == "3") {
                tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
                  .setTitle(`Cual debería de ser el Texto Pie?`)
                  .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                  .setDescription(`Es aquel texto pequeño que se encuentra en la parte de debajo del Embed!`)
                  ]
                })
                await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                    max: 1,
                    time: 90000,
                    errors: ["time"]
                  })
                  .then(collected => {
                    var text = collected.first().content;
                    try {
                      client.settings.set(message.guild.id, text, "embed.footertext")
                      es = {
                        color: GuildSettings.embed.color,
                        thumb: GuildSettings.embed.thumb,
                        wrongcolor: GuildSettings.embed.wrongcolor,
                        footertext: text,
                        footericon: GuildSettings.embed.footericon
                      }
                      message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`${client.allemojis.yes} El nuevo Texto Pie es:`.substring(0, 256))
                        .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                        .setDescription(GuildSettings.embed.footertext)
                        
                      ]});
                      
                      return;
                    } catch (e) {
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(`Ha ocurrido un error!`)
                        .setColor(GuildSettings.embed.wrongcolor)
                        .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
                        
                      ]});
                    }
                  })
                  .catch(e => {
                    timeouterror = e;
                  })
                if (timeouterror)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`${client.allemojis.no} Tu tiempo ha expirado!`)
                    .setColor(GuildSettings.embed.wrongcolor)
                    .setDescription(`Setup cancelado!`.substring(0, 2000))
                    
                  ]});
              } else if (button?.customId == "4") {
                try {
                  client.settings.set(message.guild.id, !GuildSettings.embed.thumb ,"embed.thumb")
                  es = {
                    color: GuildSettings.embed.color,
                    thumb: !GuildSettings.embed.thumb,
                    wrongcolor: GuildSettings.embed.wrongcolor,
                    footertext: GuildSettings.embed.footertext,
                    footericon: GuildSettings.embed.footericon
                  }
                  message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`${client.allemojis.yes} La miniatura ahora está ${GuildSettings.embed.thumb ? "Activada" : "Desactivada"}!`)
                    .setDescription(`${GuildSettings.embed.thumb ? "Ahora voy a" : "Ahora no voy a"} mostrar la miniatura en los Embeds!`)
                    .setColor(GuildSettings.embed.color).setThumbnail(GuildSettings.embed.thumb ? GuildSettings.embed.footericon && (GuildSettings.embed.footericon.includes("http://") || GuildSettings.embed.footericon.includes("https://")) ? GuildSettings.embed.footericon : client.user.displayAvatarURL() : null)
                    
                  ]});
                  
                  return;
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`${client.allemojis.no} Ha ocurrido un error!`)
                    .setColor(GuildSettings.embed.wrongcolor)
                    .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``)
                    
                  ]});
                }
              } 
            }
            else button?.reply({content: `${client.allemojis.no} No puedes hacer eso! Solo: <@${cmduser.id}>`, ephemeral: true});
          });
          //Once the Collections ended edit the menu message
          collector.on('end', collected => {
            tempmsg.edit({embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().customId ? `${client.allemojis.yes} **Seleccionado el Botón \`${collected.first().customId}\`.**` : "❌ **NADA SELECCIONADO - CANCELADO**" }`})
          });
    
      } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
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
  