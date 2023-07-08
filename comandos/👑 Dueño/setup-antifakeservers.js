var {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
} = require(`discord.js`);
const fs = require('fs');
const Discord = require('discord.js');
const { dbEnsure, duration } = require('../../utils/funciones');
const config = require('../../botconfig/config.json');
const ms = require('ms');
module.exports = {
    name: "setup-antifakeservers",
    category: "👑 Owner",
    type: "info",
    aliases: ["setup-spamservers", "setupantifakeservers", "antifakeservers", "setup-fakeservers"],
    cooldown: 5,
    usage: "setup-antifakeservers  -->  Sigue los pasos",
    desc: "Establece unas reglas a la hora de unirme a un servidor",
    owner: true,
    run: async (client, message, args, prefix, GuildSettings) => {
        let text = args.join(" ");
        let cmduser = message.author;
        let es = GuildSettings.embed;
        if (!client.configbot.ownerIDS.some(r => r.includes(message.author.id)))
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(`${client.allemojis.no} No tienes permitido usar este comando!`)
                    .setDescription(`Solo ellos pueden: ${config.ownerIDS.map(id => `<@${id}>`)}`)
                ]
            });

        first_layer()
        async function first_layer() {
            let menuoptions = [
                {
                    value: config.antifakeservers.enabled ? "Desactiva la Protección" : "Usar la Configuración Recomendada",
                    description: config.antifakeservers.enabled ? "Desactiva la Protección ante Servidores Falsos" : "Activa la Protección ante Servidores Falsos",
                    emoji: config.antifakeservers.enabled ? client.allemojis.no : client.allemojis.yes
                },
                {
                    value: "Establece un Límite Mínimo de Miembros",
                    description: `Límite de Miembros que tiene que tener un Servidor`,
                    emoji: `🔢`
                },
                {
                    value: "Prohíbe la ID de un Dueño",
                    description: `Añade una ID del Dueño para que no pueda Invitarme`,
                    emoji: `👤`
                },
                {
                    value: "Elimina la ID de un Dueño",
                    description: `Elimina una ID del Dueño para que pueda Invitarme`,
                    emoji: `🗑`
                },
                {
                    value: "Antigüedad Mínima de Servidor",
                    description: `Establece una Antigüedad Mínima de Servidor`,
                    emoji: `🕐`
                },
                {
                    value: "Establecer Canal de Registros",
                    description: `Establece un Canal de Informes ante estos sucesos`,
                    emoji: client.allemojis.channel
                },
                {
                    value: "Mostrar Ajustes",
                    description: `Muestra los ajustes`,
                    emoji: "📑"
                },
                {
                    value: "Cancelar",
                    description: `Cancelar y finalizar!`,
                    emoji: "🔴"
                }
            ]
            //define the selection
            let Selection = new MessageSelectMenu()
                .setCustomId('MenuSelection')
                .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                .setPlaceholder('Haz click para configurar la Blacklist!')
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
                .setAuthor({
                    name: 'Anti Servidores Falsos / Anti Spam de Servidores',
                    iconURL: 'https://images.emojiterra.com/google/android-11/512px/1f6ab.png',
                    url: client.configbot.discord
                })
                .setDescription(`***Selecciona lo que necesites en la \`Selección\` de Debajo!***`)
            //send the menu msg
            let menumsg = await message.reply({
                embeds: [MenuEmbed],
                components: [new MessageActionRow().addComponents(Selection)]
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
                filter: i => i.isSelectMenu() && i.message.author.id == client.user.id && i.user,
                time: 90000
            })
            //Menu Collections
            collector.on('collect', menu => {
                if (menu.user.id === cmduser.id) {
                    collector.stop();
                    if (menu?.values[0] == "Cancelar") return menu.reply(`${client.allemojis.no} Setup cancelado!`)
                    menu.deferUpdate();
                    handle_the_picks(menu.values[0])
                } else menu.reply({
                    content: `${client.allemojis.no} No puedes hacer eso! Solo: <@${cmduser.id}>`,
                    ephemeral: true
                });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
                menumsg.edit({
                    embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                    components: [],
                    content: `${collected && collected.first() && collected.first().values ? `${client.allemojis.yes} **Seleccionado: \`${collected ? collected.first().values[0] : "Nada"}\`**` : `${client.allemojis.no} **NADA SELECCIONADO - CANCELADO**`}`
                })
            });
        }

        async function handle_the_picks(optionhandletype) {
            switch (optionhandletype) {
                case "Usar la Configuración Recomendada":
                case "Desactiva la Protección": {
                    if (config.antifakeservers.enabled) {
                        config.antifakeservers.enabled = false;
                        fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                            if (e) {
                                console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                        .setColor(es.wrongcolor)
                                        .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            }
                            message.reply({
                                embeds: [new MessageEmbed()
                                    .setFooter({
                                        text: es.footertext,
                                        iconURL: es.footericon
                                    })
                                    .setColor(es.color)
                                    .setTitle(`${client.allemojis.yes} Desactivada la Protección ante Servidores Falsos!`)
                                ]
                            })
                            if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                            return;
                        });
                    } else {
                        config.antifakeservers.enabled = true;
                        config.antifakeservers.minServerMembers = 15;
                        config.antifakeservers.minCreationTime = 604800000; // ms (1 week)
                        fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                            if (e) {
                                console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                        .setColor(es.wrongcolor)
                                        .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            }
                            message.reply({
                                embeds: [new MessageEmbed()
                                    .setFooter({
                                        text: es.footertext,
                                        iconURL: es.footericon
                                    })
                                    .setColor(es.color)
                                    .setTitle(`${client.allemojis.yes} Activada la Configuración Recomendada!`)
                                    .setDescription(`Ahora solo permitiré unirme a servidores si:\n> 👥 **Tienen más de ${config.antifakeservers.minServerMembers} miembros**\n> 🕔 **El Servidor tiene una Antigüedad Mínima de ${duration(config.antifakeservers.minCreationTime).map(d => `\`${d}\``).join(", ")}**`)
                                ]
                            })
                            if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                            return;
                        });
                    }

                }
                    break;



                case "Establece un Límite Mínimo de Miembros": {

                    var tempmsg = await message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Que Límite Mínimo de Miembros tiene que tener el Servidor?`)
                            .setColor(es.color)
                            .setFooter({
                                text: es.footertext,
                                iconURL: es.footericon
                            })
                            .setDescription(`Envia un NÚMERO!\n\n**0 == Sin Límite**`)
                        ]
                    })
                    await tempmsg.channel.awaitMessages({
                        filter: m => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000,
                        errors: ["time"]
                    })
                        .then(collected => {
                            var message = collected.first();
                            if (isNaN(message.content) || message.content < 0 || message.content % 1 != 0) {
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setTitle(`${client.allemojis.no} No has especificado un Número Válido!`)
                                        .setColor(es.wrongcolor)
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            }

                            config.antifakeservers.minServerMembers = Number(message.content);
                            fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                                if (e) {
                                    console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                    message.reply({
                                        embeds: [new MessageEmbed()
                                            .setFooter({
                                                text: es.footertext,
                                                iconURL: es.footericon
                                            })
                                            .setColor(es.wrongcolor)
                                            .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                    return;
                                }
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                        .setColor(es.color)
                                        .setTitle(`${client.allemojis.yes} Configuración Establecida!`)
                                        .setDescription(`Ahora solo permitiré unirme a servidores si:\n> 👥 **Tienen más de ${config.antifakeservers.minServerMembers} miembros**`)
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            });

                        }).catch(e => {
                            console.log(e)
                            message.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter({
                                        text: es.footertext,
                                        iconURL: es.footericon
                                    })
                                    .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                    .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                ]
                            });
                            if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                            return;
                        })

                }
                    break;

                case "Prohíbe la ID de un Dueño": {
                    var tempmsg = await message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Que ID de Dueño quieres bloquear?`)
                            .setColor(es.color)
                            .setFooter({
                                text: es.footertext,
                                iconURL: es.footericon
                            })
                            .setDescription(`La ID será la del Dueño del Servidor, si me uno a un Servidor y veo que la ID del Dueño es igual a la ID que me has especificado, me iré del Servidor!\n\n*Envía la ID!*`)
                        ]
                    })
                    await tempmsg.channel.awaitMessages({
                        filter: m => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000,
                        errors: ["time"]
                    })
                        .then(collected => {
                            var message = collected.first();
                            if (isNaN(message.content) || message.content < 0 || message.content % 1 != 0) {
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setTitle(`${client.allemojis.no} No has especificado una ID Válida!`)
                                        .setColor(es.wrongcolor)
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            }

                            config.antifakeservers.blacklistedOwnerIds.push(message.content);
                            fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                                if (e) {
                                    console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                    message.reply({
                                        embeds: [new MessageEmbed()
                                            .setFooter({
                                                text: es.footertext,
                                                iconURL: es.footericon
                                            })
                                            .setColor(es.wrongcolor)
                                            .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                    return;
                                }
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                        .setColor(es.color)
                                        .setTitle(`${client.allemojis.yes} Configuración Establecida!`)
                                        .setDescription(`Ahora solo permitiré unirme a servidores si:\n> 👥 **La ID del Dueño no es igual a: ${[...config.antifakeservers.blacklistedOwnerIds, message.content].map(o => `\`${o}\``).join("\n")}**`)
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            });

                        }).catch(e => {
                            console.log(e)
                            message.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter({
                                        text: es.footertext,
                                        iconURL: es.footericon
                                    })
                                    .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                    .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                ]
                            });
                            if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                            return;
                        })
                }
                    break;

                case "Elimina la ID de un Dueño": {
                    if (!config.antifakeservers.blacklistedOwnerIds.length) {
                        message.reply(`${client.allemojis.no} **No hay ninguna ID de Dueño bloqueada, añade una primero!**`)
                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                        return;
                    }
                    var tempmsg = await message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Que ID de Dueño quieres eliminar?`)
                            .setColor(es.color)
                            .setFooter({
                                text: es.footertext,
                                iconURL: es.footericon
                            })
                            .setDescription(`*Envía la ID!*`)
                            .addField(`IDS en la Configuración:`, `${config.antifakeservers.blacklistedOwnerIds.length >= 1 ? config.antifakeservers.blacklistedOwnerIds.map(o => `\`${o}\``).join(", ") : "No hay IDS Añadidas"}`)
                        ]
                    })
                    await tempmsg.channel.awaitMessages({
                        filter: m => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000,
                        errors: ["time"]
                    })
                        .then(collected => {
                            var message = collected.first();

                            let index = config.antifakeservers.blacklistedOwnerIds.indexOf(message.content);
                            if(index < 0) {
                                message.reply(`${client.allemojis.no} **No hay ninguna ID de Dueño Bloqueada con esa ID!**`)
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            }

                            config.antifakeservers.blacklistedOwnerIds.splice(index, 1);
                            fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                                if (e) {
                                    console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                    message.reply({
                                        embeds: [new MessageEmbed()
                                            .setFooter({
                                                text: es.footertext,
                                                iconURL: es.footericon
                                            })
                                            .setColor(es.wrongcolor)
                                            .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                    return;
                                }
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                        .setColor(es.color)
                                        .setTitle(`${client.allemojis.yes} Configuración Establecida!`)
                                        .setDescription(`**${config.antifakeservers.blacklistedOwnerIds.length >= 1 ? "Ahora solo permitiré unirme a servidores si:\n> 👥 La ID del Dueño no es igual a " + config.antifakeservers.blacklistedOwnerIds.map(o => `\`${o}\``).join(", ") : "No hay dueños prohibidos!"}**`)
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            });

                        }).catch(e => {
                            console.log(e)
                            message.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter({
                                        text: es.footertext,
                                        iconURL: es.footericon
                                    })
                                    .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                    .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                ]
                            });
                            if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                            return;
                        })
                }
                    break;

                case "Antigüedad Mínima de Servidor": {
                    var tempmsg = await message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Qué Antigüedad Mínima tiene que tener el Servidor?`)
                            .setColor(es.color)
                            .setFooter({
                                text: es.footertext,
                                iconURL: es.footericon
                            })
                            .setDescription(`Envia el Tiempo!\n\n> **Ejemplo: \`7d\`**`)
                        ]
                    })
                    await tempmsg.channel.awaitMessages({
                        filter: m => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000,
                        errors: ["time"]
                    })
                        .then(collected => {
                            var message = collected.first();
                            let time = ms(message.content);
                            if (isNaN(time) || time == undefined || !time) {
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setTitle(`${client.allemojis.no} No has especificado un Tiempo Válido!`)
                                        .setColor(es.wrongcolor)
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            }

                            config.antifakeservers.minCreationTime = Number(time);
                            fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                                if (e) {
                                    console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                    message.reply({
                                        embeds: [new MessageEmbed()
                                            .setFooter({
                                                text: es.footertext,
                                                iconURL: es.footericon
                                            })
                                            .setColor(es.wrongcolor)
                                            .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                    return;
                                }
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                        .setColor(es.color)
                                        .setTitle(`${client.allemojis.yes} Configuración Establecida!`)
                                        .setDescription(`Ahora solo permitiré unirme a servidores si:\n> 🕐 **Tiene una Antigüedad Mínima de ${duration(time).map(d => `\`${d}\``).join(", ")}**`)
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            });

                        }).catch(e => {
                            console.log(e)
                            message.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter({
                                        text: es.footertext,
                                        iconURL: es.footericon
                                    })
                                    .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                    .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                ]
                            });
                            if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                            return;
                        })
                }
                break;


                case "Establecer Canal de Registros": {
                    var tempmsg = await message.reply({
                        embeds: [new MessageEmbed()
                            .setTitle(`Que Canal quieres usar para los Registros?`)
                            .setColor(es.color)
                            .setFooter({
                                text: es.footertext,
                                iconURL: es.footericon
                            })
                            .setDescription(`Menciona el Canal o Envía su ID!\nEnvía \`no\` si no quieres usar ningún canal!`)
                        ]
                    })
                    await tempmsg.channel.awaitMessages({
                        filter: m => m.author.id == cmduser.id,
                        max: 1,
                        time: 90000,
                        errors: ["time"]
                    })
                        .then(collected => {
                            var message = collected.first();
                            if(message.content == "no"){
                                config.antifakeservers.logChannel = "no";
                                fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                                    if (e) {
                                        console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                        message.reply({
                                            embeds: [new MessageEmbed()
                                                .setFooter({
                                                    text: es.footertext,
                                                    iconURL: es.footericon
                                                })
                                                .setColor(es.wrongcolor)
                                                .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                            ]
                                        })
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                        return;
                                    }
                                    message.reply({
                                        embeds: [new MessageEmbed()
                                            .setFooter({
                                                text: es.footertext,
                                                iconURL: es.footericon
                                            })
                                            .setColor(es.color)
                                            .setTitle(`${client.allemojis.yes} Configuración Establecida!`)
                                            .setDescription(`Ahora no enviaré los Registros de los Sucesos!`)
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                    return;
                                });
                                return;
                            }
                            let channel = message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first() || message.guild.channels.cache.get(message.content);
                            if (!channel) {
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setTitle(`${client.allemojis.no} No se ha encontrado el Canal que has Especificado!`)
                                        .setColor(es.wrongcolor)
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            }

                            config.antifakeservers.logChannel = channel.id;
                            fs.writeFile(`./botconfig/config.json`, JSON.stringify(client.configbot, null, 3), (e) => {
                                if (e) {
                                    console.log(e.stack ? String(e.stack).dim : String(e).dim);
                                    message.reply({
                                        embeds: [new MessageEmbed()
                                            .setFooter({
                                                text: es.footertext,
                                                iconURL: es.footericon
                                            })
                                            .setColor(es.wrongcolor)
                                            .setTitle(`${client.allemojis.no} ERROR Escribiendo el Fichero`)
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                    return;
                                }
                                message.reply({
                                    embeds: [new MessageEmbed()
                                        .setFooter({
                                            text: es.footertext,
                                            iconURL: es.footericon
                                        })
                                        .setColor(es.color)
                                        .setTitle(`${client.allemojis.yes} Configuración Establecida!`)
                                        .setDescription(`Ahora enviaré los Registros de los Sucesos en:\n> ${client.allemojis.channel} <#${channel.id}> | \`${channel.id}\``)
                                    ]
                                })
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                                return;
                            });

                        }).catch(e => {
                            console.log(e)
                            message.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter({
                                        text: es.footertext,
                                        iconURL: es.footericon
                                    })
                                    .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                    .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                ]
                            });
                            if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                            return;
                        })
                }
                break;
                
                    case "Mostrar Ajustes": {
                    message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setTitle(`🚫 Configuración de Servidores Falsos / Spam de Servidores`)
                            .addField(`🟢 Activo`, `> ${config.antifakeservers.enabled ? "`Activado`" : "`Desactivado`"}`)
                            .addField(`🔢 __Límite Mínimo de Miembros__:`, `> ${config.antifakeservers.enabled && config.antifakeservers.minServerMembers !== 0 ? `\`${config.antifakeservers.minServerMembers} Miembros\`` : "\`Desactivado\`"}`)
                            .addField(`🕐 __Antigüedad Mínima de Servidor__:`, `> ${config.antifakeservers.enabled ? `${duration(config.antifakeservers.minCreationTime).map(d => `\`${d}\``).join(", ")}` : "\`Desactivado\`"}`)
                            .addField(`👤 __Dueños Bloqueados__:`, `> ${config.antifakeservers.enabled && config.antifakeservers.blacklistedOwnerIds.length >= 1 ? `${config.antifakeservers.blacklistedOwnerIds.map(o => `\`${o}\``).join(" ")}` : "\`Desactivado\`"}`)
                            .addField(`${client.allemojis.channel} __Canal de Registros__:`, `> ${config.antifakeservers.enabled && message.guild.channels.cache.get(config.antifakeservers.logChannel) ? `<#${config.antifakeservers.logChannel}>` : "\`Desactivado\`"}`)
                            .setColor(es.color)
                            .setFooter({
                                text: es.footertext,
                                iconURL: es.footericon
                            })
                        ]
                    })
                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.setups.get(message.guild.id));
                    return;
                }
                    break;

            }
        }
    },
};