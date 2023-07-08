var {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
} = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
const fs = require('fs');
var {
    isValidURL,
    nFormatter
} = require(`${process.cwd()}/utils/funciones`);
const moment = require("moment")
module.exports = {
    name: "changestatus",
    category: "👑 Owner",
    type: "bot",
    aliases: ["botstatus", "status"],
    cooldown: 5,
    usage: "changestatus  -->  Sigue los pasos",
    desc: "Cambia el estado del Bot",
    run: async (client, message, args, prefix, GuildSettings) => {
        let cmduser = message.author;
        let es = GuildSettings.embed;
        if (!config.ownerIDS.some(r => r.includes(message.author.id)))
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(`${client.allemojis.no} No tienes permitido usar este comando!`)
                    .setDescription(`Solo ellos pueden: ${config.ownerIDS.map(id => `<@${id}>`)}`)
                ]
            });
        try {
            first_layer()
            async function first_layer() {
                let menuoptions = [
                    {
                        value: "Estado 1. Texto",
                        description: `Cambia el Primer Texto del Estado`,
                        emoji: "📝"
                    },
                    {
                        value: "Estado 2. Texto",
                        description: `Cambia el Segundo Texto del Estado`,
                        emoji: "📝"
                    },
                    {
                        value: "Tipo de Estado",
                        description: `Cambia el Tipo de Estado a: Jugando/Escuchando/...`,
                        emoji: "🔰"
                    },
                    {
                        value: "URL De Estado",
                        description: `Si el estado es Retransmitiendo, cambiar URL`,
                        emoji: "🔗"
                    },
                    {
                        value: "Estado de Conexión",
                        description: `Cambia la conexión a: Conectado/Ausente/Ocupado/Retransmitiendo`,
                        emoji: "🔖"
                    },
                    {
                        value: "Cancelar",
                        description: `Cancelar y finalizar!`,
                        emoji: "862306766338523166"
                    }
                ]
                //define the selection
                let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                    .setPlaceholder('Haz click para cambiar el estado!')
                    .addOptions(
                        menuoptions.map(option => {
                            let Obj = {
                                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                value: option.value.substring(0, 50),
                                description: option.description.substring(0, 50),
                            }
                            if (option.emoji) Obj.emoji = option.emoji;
                            return Obj;
                        }))

                //define the embed
                let MenuEmbed = new MessageEmbed()
                    .setColor(es.color)
                    .setAuthor({ name: 'Cambiar Estado', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/au-kddi/190/purple-heart_1f49c.png', url: 'https://discord.gg/MBPsvcphGf' })
                    .setDescription("***Selecciona lo que necesites en la `Selección` de Debajo!***")
                //send the menu msg
                let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
                //Create the collector
                const collector = menumsg.createMessageComponentCollector({
                    filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                    time: 90000
                })
                //Menu Collections
                collector.on('collect', menu => {
                    if (menu?.user.id === cmduser.id) {
                        collector.stop();
                        if (menu?.values[0] == "Cancelar") return menu?.reply(`${client.allemojis.no} Setup cancelado!`)
                        menu?.deferUpdate();
                        handle_the_picks(menu?.values[0])
                    }
                    else menu?.reply({ content: `${client.allemojis.no} No puedes hacer eso! Solo: <@${cmduser.id}>`, ephemeral: true });
                });
                //Once the Collections ended edit the menu message
                collector.on('end', collected => {
                    menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `${client.allemojis.yes} **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
                });
            }

            async function handle_the_picks(optionhandletype) {
                switch (optionhandletype) {
                    case "Estado 1. Texto":
                        {
                            var tempmsg = await message.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Que texto debería mostrar para el Estado n.1?`)
                                    .setColor(es.color)
                                    .setDescription(`Ejemplo: \`${prefix}help | ${client.user.username.split(" ")[0]} | by: dewstouh#1088\`
        
                *Escríbelo ahora!*`)
                                    .addField("PALABRAS CLAVE que serán reemplazadas:", `\`{guildcount}\` .. Cantidad de Servidores
                \`{prefix}\` .. Prefijo del BOT
                \`{membercount}\` .. Cantidad de Miembros
                \`{created}\` .. Muestra la fecha de creación del Bot
                
                \`{createdtime}\` .. Muestra el tiempo desde que se creó
                \`{name}\` .. Muestra el Nombre del Bot
                \`{tag}\` ... Muestra el Nombre del Bot#1234 y el tag
                \`{commands}\` .. Muestra todos los comandos
                \`{usedcommands}\` .. Muestra los comandos usados
                \`{songsplayed}\` .. Muestra las canciones reproducidas`)
                                ]
                            })
                            await tempmsg.channel.awaitMessages({
                                filter: m => m.author.id == cmduser.id,
                                max: 1,
                                time: 90000,
                                errors: ["time"]
                            })
                                .then(async collected => {
                                    var msg = collected.first().content;
                                    let status = config
                                    let newStatusText = msg
                                        .replace("{prefix}", config.prefix)
                                        .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
                                        .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
                                        .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
                                        .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
                                        .replace("{name}", client.user.username)
                                        .replace("{tag}", client.user.tag)
                                        .replace("{commands}", client.commands.size)
                                        .replace("{usedcommands}", nFormatter(Math.ceil(client.stats.get("global", "commands") * [...client.guilds.cache.values()].length / 10), 2))
                                        .replace("{songsplayed}", nFormatter(Math.ceil(client.stats.get("global", "songs") * [...client.guilds.cache.values()].length / 10), 2))
                                    newStatusText = String(newStatusText).substring(0, 128);
                                    status.status.text = String(msg).substring(0, 128);
                                    client.user.setActivity(newStatusText, {
                                        type: config.status.type,
                                        url: config.status.url
                                    })
                                    fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                                        if (e) {
                                            console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                            return message.channel.send({
                                                embeds: [new MessageEmbed()

                                                    .setColor(es.wrongcolor)
                                                    .setTitle(`${client.allemojis.no} Error al guardar el archivo!`)
                                                    .setDescription(`${e.stack ? String(e.stack).dim : String(e).dim}`)
                                                ]
                                            })
                                        }
                                        return message.channel.send({
                                            embeds: [new MessageEmbed()

                                                .setColor(es.color)
                                                .setTitle(`Cambiado el Estado 1 a:\n> \`${newStatusText}\``)
                                            ]
                                        })
                                    });
                                }).catch(e => {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new MessageEmbed()
                                            .setTitle(`${client.allemojis.no} Error al guardar el archivo!`)
                                            .setColor(es.wrongcolor)
                                            .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``.substring(0, 2000))

                                        ]
                                    });
                                })
                        }
                        break;
                    case "Estado 2. Texto":
                        {
                            var tempmsg = await message.reply({
                                embeds: [new MessageEmbed()
                                    .setTitle(`Que texto debería mostrar para el Estado n.2?`)
                                    .setColor(es.color)
                                    .setDescription(`Ejemplo: \`${prefix}help | ${client.user.username.split(" ")[0]} | by: dewstouh#1088\`
        
                *Escríbelo ahora!*`)
                                    .addField("PALABRAS CLAVE que serán reemplazadas:", `\`{guildcount}\` .. Cantidad de Servidores
                \`{prefix}\` .. Prefijo del BOT
                \`{membercount}\` .. Cantidad de Miembros
                \`{created}\` .. Muestra la fecha de creación del Bot
                
                \`{createdtime}\` .. Muestra el tiempo desde que se creó
                \`{name}\` .. Muestra el Nombre del Bot
                \`{tag}\` ... Muestra el Nombre del Bot#1234 y el tag
                \`{commands}\` .. Muestra todos los comandos
                \`{usedcommands}\` .. Muestra los comandos usados
                \`{songsplayed}\` .. Muestra las canciones reproducidas`)
                                ]
                            })
                            await tempmsg.channel.awaitMessages({
                                filter: m => m.author.id == cmduser.id,
                                max: 1,
                                time: 90000,
                                errors: ["time"]
                            })
                                .then(async collected => {
                                    var msg = collected.first().content;
                                    let status = config
                                    let newStatusText = msg
                                        .replace("{prefix}", config.prefix)
                                        .replace("{guildcount}", nFormatter(client.guilds.cache.size, 2))
                                        .replace("{membercount}", nFormatter(client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0), 2))
                                        .replace("{created}", moment(client.user.createdTimestamp).format("DD/MM/YYYY"))
                                        .replace("{createdime}", moment(client.user.createdTimestamp).format("HH:mm:ss"))
                                        .replace("{name}", client.user.username)
                                        .replace("{tag}", client.user.tag)
                                        .replace("{commands}", client.commands.size)
                                        .replace("{usedcommands}", nFormatter(Math.ceil(client.stats.get("global", "commands") * [...client.guilds.cache.values()].length / 10), 2))
                                        .replace("{songsplayed}", nFormatter(Math.ceil(client.stats.get("global", "songs") * [...client.guilds.cache.values()].length / 10), 2))
                                    newStatusText = String(newStatusText).substring(0, 128);
                                    status.status.text2 = String(msg).substring(0, 128);
                                    client.user.setActivity(newStatusText, {
                                        type: config.status.type,
                                        url: config.status.url
                                    })
                                    fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                                        if (e) {
                                            console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                            return message.channel.send({
                                                embeds: [new MessageEmbed()

                                                    .setColor(es.wrongcolor)
                                                    .setTitle(`${client.allemojis.no} Error al guardar el archivo!`)
                                                    .setDescription(`${e.stack ? String(e.stack).dim : String(e).dim}`)
                                                ]
                                            })
                                        }
                                        return message.channel.send({
                                            embeds: [new MessageEmbed()

                                                .setColor(es.color)
                                                .setTitle(`Cambiado el Estado n.2 a:\n> \`${newStatusText}\``)
                                            ]
                                        })
                                    });
                                }).catch(e => {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new MessageEmbed()
                                            .setTitle(`${client.allemojis.no} Error al guardar el archivo!`)
                                            .setColor(es.wrongcolor)
                                            .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``.substring(0, 2000))

                                        ]
                                    });
                                })
                        }
                        break;
                    case "Tipo de Estado":
                        {
                            second_layer()
                            async function second_layer() {
                                let menuoptions = [
                                    {
                                        value: "PLAYING",
                                        description: `e.g: Jugando a ${config.status.text}`
                                    },
                                    {
                                        value: "WATCHING",
                                        description: `e.g: Viendo ${config.status.text}`
                                    },
                                    {
                                        value: "STREAMING",
                                        description: `e.g: Retransmitiendo ${config.status.text}`
                                    },
                                    {
                                        value: "LISTENING",
                                        description: `e.g: Escuchando ${config.status.text}`
                                    },
                                    {
                                        value: "COMPETING",
                                        description: `e.g: Compitiendo en ${config.status.text}`
                                    },
                                    {
                                        value: "Cancelar",
                                        description: `Cancelar y finalizar!`,
                                        emoji: "862306766338523166"
                                    }
                                ]
                                //define the selection
                                let Selection = new MessageSelectMenu()
                                    .setCustomId('MenuSelection')
                                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                                    .setPlaceholder('Haz click para cambiar el Estado')
                                    .addOptions(
                                        menuoptions.map(option => {
                                            let Obj = {
                                                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                                value: option.value.substring(0, 50),
                                                description: option.description.substring(0, 50),
                                            }
                                            if (option.emoji) Obj.emoji = option.emoji;
                                            return Obj;
                                        }))

                                //define the embed
                                let MenuEmbed = new MessageEmbed()
                                    .setColor(es.color)
                                    .setAuthor({ name: 'Cambiar Estado', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/au-kddi/190/purple-heart_1f49c.png', url: 'https://discord.gg/MBPsvcphGf' })
                                    .setDescription("***Selecciona lo que necesites en la `Selección` de Debajo!***")
                                //send the menu msg
                                let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
                                //Create the collector
                                const collector = menumsg.createMessageComponentCollector({
                                    filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                                    time: 90000
                                })
                                //Menu Collections
                                collector.on('collect', menu => {
                                    if (menu?.user.id === cmduser.id) {
                                        collector.stop();
                                        if (menu?.values[0] == "Cancelar") return menu?.reply(`${client.allemojis.no} Setup cancelado!`)
                                        menu?.deferUpdate();
                                        let temptype = menu?.values[0]
                                        let status = config
                                        status.status.type = temptype;
                                        client.user.setActivity(config.status.text, {
                                            type: temptype,
                                            url: config.status.url
                                        })
                                        fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                                            if (e) {
                                                console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                                return message.channel.send({
                                                    embeds: [new MessageEmbed()

                                                        .setColor(es.wrongcolor)
                                                        .setTitle(`${client.allemojis.no} Error al guardar el archivo!`)
                                                        .setDescription(`${e.stack ? String(e.stack).dim : String(e).dim}`)
                                                    ]
                                                })
                                            }
                                            return message.channel.send({
                                                embeds: [new MessageEmbed()

                                                    .setColor(es.color)
                                                    .setTitle(`Cambiado el Tipo de Estado n.3\n> \`${temptype}\``)
                                                ]
                                            })
                                        });
                                    }
                                    else menu?.reply({ content: `${client.allemojis.no} No puedes hacer eso! Solo: <@${cmduser.id}>`, ephemeral: true });
                                });
                                //Once the Collections ended edit the menu message
                                collector.on('end', collected => {
                                    menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `${client.allemojis.yes} **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
                                });
                            }
                        }
                        break;
                    case "URL De Estado": {
                        tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`${client.allemojis.yes} URL de Estado`)
                                .setColor(es.color)
                                .setDescription(`
              Ejemplo: \`https://twitch.tv/#\` --> link de twitch
      
              *Envia el link!*`)
                            ]
                        })
                        await tempmsg.channel.awaitMessages({
                            filter: m => m.author.id == cmduser.id,
                            max: 1,
                            time: 90000,
                            errors: ["time"]
                        })
                            .then(async collected => {
                                var msg = collected.first().content;
                                if (!isValidURL(msg))
                                    return message.channel.send({
                                        embeds: [new MessageEmbed()

                                            .setColor(es.wrongcolor)
                                            .setTitle(`${client.allemojis.no} URL no válida!`)
                                        ]
                                    })
                                if (!msg.includes("twitch"))
                                    return message.channel.send({
                                        embeds: [new MessageEmbed()

                                            .setColor(es.wrongcolor)
                                            .setTitle(`${client.allemojis.no} URL de Twitch no válida!`)
                                        ]
                                    })
                                let status = config
                                status.status.url = msg;
                                client.user.setActivity(config.status.text, {
                                    type: config.status.type,
                                    url: msg
                                })
                                fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                                    if (e) {
                                        console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                        return message.channel.send({
                                            embeds: [new MessageEmbed()

                                                .setColor(es.wrongcolor)
                                                .setTitle(`${client.allemojis.no} Error al guardar el archivo!`)
                                                .setDescription(`${e.stack ? String(e.stack).dim : String(e).dim}`)
                                            ]
                                        })
                                    }
                                    return message.channel.send({
                                        embeds: [new MessageEmbed()

                                            .setColor(es.color)
                                            .setTitle(`Cambiado el URL de Estado a\n> \`${msg}\``)
                                        ]
                                    })
                                });
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new MessageEmbed()
                                        .setTitle(`${client.allemojis.no} **Error!**`)
                                        .setColor(es.wrongcolor)
                                        .setDescription(`\`\`\`${String(e.message ? e.message : e).substring(0, 2000)}\`\`\``.substring(0, 2000))

                                    ]
                                });
                            })
                    } break;
                    case "Estado de Conexión":
                        {
                            second_layer()
                            async function second_layer() {
                                let menuoptions = [
                                    {
                                        value: "online",
                                        description: `Mostrar como Conectado`,
                                        emoji: "🟢"
                                    },
                                    {
                                        value: "idle",
                                        description: `Mostrar como Ausente`,
                                        emoji: "🟡"
                                    },
                                    {
                                        value: "dnd",
                                        description: `Mostrar como Ocupado`,
                                        emoji: "🔴"
                                    },
                                    {
                                        value: "Cancelar",
                                        description: `Cancelar y finalizar!`,
                                        emoji: "862306766338523166"
                                    }
                                ]
                                //define the selection
                                let Selection = new MessageSelectMenu()
                                    .setCustomId('MenuSelection')
                                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                                    .setPlaceholder('Click me to change the Status')
                                    .addOptions(
                                        menuoptions.map(option => {
                                            let Obj = {
                                                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                                                value: option.value.substring(0, 50),
                                                description: option.description.substring(0, 50),
                                            }
                                            if (option.emoji) Obj.emoji = option.emoji;
                                            return Obj;
                                        }))

                                //define the embed
                                let MenuEmbed = new MessageEmbed()
                                    .setColor(es.color)
                                    .setAuthor({ name: 'Cambiar Estado', iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/au-kddi/190/purple-heart_1f49c.png', url: 'https://discord.gg/MBPsvcphGf' })
                                    .setDescription("***Selecciona lo que necesites en la `Selección` de Debajo!***")
                                //send the menu msg
                                let menumsg = await message.reply({ embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)] })
                                //Create the collector
                                const collector = menumsg.createMessageComponentCollector({
                                    filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
                                    time: 90000
                                })
                                //Menu Collections
                                collector.on('collect', menu => {
                                    if (menu?.user.id === cmduser.id) {
                                        collector.stop();
                                        if (menu?.values[0] == "Cancelar") return menu?.reply(`${client.allemojis.no} Setup cancelado!`)
                                        menu?.deferUpdate();
                                        let temptype = menu?.values[0]
                                        client.user.setStatus(temptype)
                                        return message.channel.send({
                                            embeds: [new MessageEmbed()

                                                .setColor(es.color)
                                                .setTitle(`Cambiado el Estado de Conexión a\n> \`${temptype}\``)
                                            ]
                                        })
                                    }
                                    else menu?.reply({ content: `${client.allemojis.no} No puedes hacer eso! Solo: <@${cmduser.id}>`, ephemeral: true });
                                });
                                //Once the Collections ended edit the menu message
                                collector.on('end', collected => {
                                    menumsg.edit({ embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `${client.allemojis.yes} **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : "❌ **NADA SELECCIONADO - CANCELADO**"}` })
                                });
                            }
                        }
                        break;

                }
            }
        } catch (e) {
            console.log(String(e.stack).dim.bgRed)
            return message.channel.send({
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