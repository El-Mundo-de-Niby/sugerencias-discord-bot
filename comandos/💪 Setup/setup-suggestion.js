var {
    MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
const {
    MessageActionRow,
    MessageSelectMenu
} = require('discord.js')
module.exports = {
    name: "setup-suggestion",
    category: "💪 Setup",
    aliases: ["setupsuggestion", "suggestionsetup", "suggestsetup", "suggestion-setup", "suggest-setup", "setup-suggest", "setupsuggest", "setup-sugerencias", "sugerencias-setup", "config"],
    cooldown: 5,
    usage: "setup-suggestion  -->  Sigue los pasos",
    desc: "Crea un sistema de sugerencias para escuchar las sugerencias del servidor y ver las votaciones",
    memberpermissions: ["ADMINISTRATOR"],
    type: "system",
    run: async (client, message, args, prefix, GuildSettings) => {

        let cmduser = message.author;
        let text = args.join(" ")
        let es = GuildSettings.embed;


        try {

            first_layer()
            async function first_layer() {
                let menuoptions = [{
                    value: message.guild.channels.cache.get(GuildSettings.suggestions.channel) ? "Desactivar el Sistema de Sugerencias" : "Activar el Sistema de Sugerencias",
                    description: message.guild.channels.cache.get(GuildSettings.suggestions.channel) ? "Desactiva el Sistema de Sugerencias" : "Activa el Sistema de Sugerencias",
                    emoji: message.guild.channels.cache.get(GuildSettings.suggestions.channel) ? client.allemojis.no : client.allemojis.yes
                },
                {
                    value: "Texto de Aceptado",
                    description: `Define el Texto de Aceptado`,
                    emoji: "1️⃣"
                },
                {
                    value: "Texto de Denegado",
                    description: `Define el Texto de Denegado`,
                    emoji: "2️⃣"
                },
                {
                    value: "Texto de Quizás",
                    description: `Define el Texto de Quizás`,
                    emoji: "3️⃣"
                },
                {
                    value: "Texto de Estado",
                    description: `Define el Texto de Estado`,
                    emoji: "4️⃣"
                },
                {
                    value: "Texto de Pronto",
                    description: `Define el Texto de Pronto`,
                    emoji: "5️⃣"
                },
                {
                    value: "Texto Pie",
                    description: `Define el Texto Pie`,
                    emoji: "6️⃣"
                },
                {
                    value: "Emoji de Voto Positivo",
                    description: `Define el Emoji de Voto Positivo`,
                    emoji: "👍"
                },
                {
                    value: "Emoji de Voto Negativo",
                    description: `Define el Emoji de Voto Negativo`,
                    emoji: "👎"
                },
                {
                    value: "Reestablecer Configuración",
                    description: `Reestablecer la Configuración Actual`,
                    emoji: "🗑"
                },
                {
                    value: "Cancelar",
                    description: `Cancelar y finalizar!`,
                    emoji: "🔴"
                }
                ]
                //Define el selection
                let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
                    .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
                    .setPlaceholder('Haz click para configurar el Sistema de Sugerencias')
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

                //Define el embed
                let MenuEmbed = new MessageEmbed()
                    .setColor(es.color)
                    .setAuthor({name: 'Sistema de Sugerencias', iconURL: 'https://images-ext-1.discordapp.net/external/WPn7kKaOE_jOyfHuTBTCm9zb6FOxcg7WYTu-vdKaYak/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/light-bulb_1f4a1.png', url: client.configbot.discord})
                    .setDescription(`***Selecciona lo que necesites en la \`Selección\` de Debajo***`)
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
                        if (menu?.values[0] == "Cancelar") return menu.reply(`❌ Configuración cancelada!`)
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
                    case "Activar el Sistema de Sugerencias": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Que canal quieres usar?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`*Menciona el canal con #canal o envia su ID*`)
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
                                var channel = message.guild.channels.cache.get(message.content) || message.mentions.channels.filter(ch => ch.guild.id == message.guild.id).first();
                                if (channel) {
                                    try {
                                        client.settings.set(message.guild.id, channel.id, "suggestions.channel");
                                        message.reply({
                                            embeds: [
                                                new Discord.MessageEmbed()
                                                    .setTitle(`${client.allemojis.yes} El canal **\`${channel.name}\`** es ahora el Canal de Sugerencias!`)
                                                    .setDescription(`Empieza a escribir en el canal para crear una sugerencia, para aceptarlas/denegarlas usa: \`${prefix}suggest <accept/deny/maybe> <IDMENSAJE> [RAZON]\``)
                                                    .setColor(es.color)
                                                    .setFooter({ text: es.footertext, iconURL: es.footericon })
                                            ]
                                        })
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                        return;
                                    } catch (e) {
                                        console.log(e)
                                        return message.reply({
                                            embeds: [new Discord.MessageEmbed()
                                                .setColor(client.configbot.wrongcolor)
                                                .setFooter(data.footertext, data.footericon)
                                                .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                                .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                            ]
                                        });
                                    }
                                } else {
                                    message.reply("ID NO VÁLIDA");
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                }
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(client.configbot.wrongcolor)
                                        .setFooter(data.footertext, data.footericon)
                                        .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                        .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                    ]
                                });
                            })
                    }
                        break;

                    case "Desactivar el Sistema de Sugerencias": {
                        client.settings.set(message.guild.id, "", "suggestions.channel");
                        message.reply({
                            embeds: [
                                new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} Se ha Desactivado el Sistema de Sugerencias!`).setColor(es.color).setFooter({ text: es.footertext, iconURL: es.footericon })
                            ]
                        })
                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                        return;
                    }
                        break;


                    case "Texto de Aceptado": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Escribe el mensaje! Ejemplo: \`Idea Aceptada!\``)
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
                                try {
                                    client.settings.set(message.guild.id, message.content, "suggestions.approvemsg");
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setDescription(message.content)
                                                .setColor(es.color)
                                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                } catch (e) {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                            .setColor(client.configbot.wrongcolor)
                                            .setFooter(data.footertext, data.footericon)
                                            .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                            .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                        ]
                                    });
                                }
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(client.configbot.wrongcolor)
                                        .setFooter(data.footertext, data.footericon)
                                        .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                        .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                    ]
                                });
                            })
                    }
                        break;

                    case "Texto de Denegado": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Escribe el mensaje! Ejemplo: \`Idea Rechazada! Lo siento, pero no estamos interesados en el momento.\``)
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
                                try {
                                    client.settings.set(message.guild.id, message.content, "suggestions.denymsg");
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setDescription(message.content)
                                                .setColor(es.color)
                                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                } catch (e) {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                            .setColor(client.configbot.wrongcolor)
                                            .setFooter(data.footertext, data.footericon)
                                            .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                            .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                        ]
                                    });
                                }
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(client.configbot.wrongcolor)
                                        .setFooter(data.footertext, data.footericon)
                                        .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                        .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                    ]
                                });
                            })
                    }
                        break;

                    case "Texto de Quizás": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Escribe el mensaje! Ejemplo: \`Puede que lo hagamos! Pero tenemos que verlo...\``)
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
                                try {
                                    client.settings.set(message.guild.id, message.content, "suggestions.maybemsg");
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setDescription(message.content)
                                                .setColor(es.color)
                                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                } catch (e) {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                            .setColor(client.configbot.wrongcolor)
                                            .setFooter(data.footertext, data.footericon)
                                            .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                            .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                        ]
                                    });
                                }
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(client.configbot.wrongcolor)
                                        .setFooter(data.footertext, data.footericon)
                                        .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                        .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                    ]
                                });
                            })
                    }
                        break;

                    case "Texto de Estado": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Escribe el mensaje! Ejemplo: \`En espera...\``)
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
                                try {
                                    client.settings.set(message.guild.id, message.content, "suggestions.statustext");
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setDescription(message.content)
                                                .setColor(es.color)
                                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                } catch (e) {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                            .setColor(client.configbot.wrongcolor)
                                            .setFooter(data.footertext, data.footericon)
                                            .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                            .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                        ]
                                    });
                                }
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(client.configbot.wrongcolor)
                                        .setFooter(data.footertext, data.footericon)
                                        .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                        .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                    ]
                                });
                            })
                    }
                        break;

                    case "Texto de Pronto": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Escribe el mensaje! Ejemplo: \`Pronto! Ya estamos trabajando en ello...\``)
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
                                try {
                                    client.settings.set(message.guild.id, message.content, "suggestions.soontext");
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el Texto de Pronto`)
                                                .setDescription(message.content)
                                                .setColor(es.color)
                                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                } catch (e) {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                            .setColor(client.configbot.wrongcolor)
                                            .setFooter(data.footertext, data.footericon)
                                            .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                            .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                        ]
                                    });
                                }
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(client.configbot.wrongcolor)
                                        .setFooter(data.footertext, data.footericon)
                                        .setTitle(`${client.allemojis.no} Your Tu tiempo ha expirado!`)
                                        .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                    ]
                                });
                            })
                    }
                        break;

                    case "Texto Pie": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Escribe el mensaje! Ejemplo: \`Quieres sugerir algo? Envíalo en este canal.\``)
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
                                try {
                                    client.settings.set(message.guild.id, message.content, "suggestions.footertext");
                                    message.reply({
                                        embeds: [
                                            new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el Texto Pie`)
                                                .setDescription(message.content)
                                                .setColor(es.color)
                                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                } catch (e) {
                                    console.log(e)
                                    return message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                            .setColor(client.configbot.wrongcolor)
                                            .setFooter(data.footertext, data.footericon)
                                            .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                            .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                        ]
                                    });
                                }
                            }).catch(e => {
                                console.log(e)
                                return message.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setColor(client.configbot.wrongcolor)
                                        .setFooter(data.footertext, data.footericon)
                                        .setTitle(`${client.allemojis.no} ERROR | Ha ocurrido un error`)
                                        .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                    ]
                                });
                            })
                    }
                        break;


                    case "Emoji de Voto Positivo": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Reacciona en **este mensaje**`)
                            ]
                        })
                        const filter = (reaction, user) => {
                            return user.id == message.author.id;
                        };
                        tempmsg.awaitReactions({
                            filter,
                            max: 1,
                            time: 90000
                        }).then(collected => {
                            var reaction = collected.first()
                            if (reaction) {
                                try {
                                    if (collected.first().emoji.id && collected.first().emoji.id.length > 2) {
                                        client.settings.set(message.guild.id, collected.first().emoji.id, "suggestions.approveemoji");
                                        message.reply({
                                            embeds: [new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setColor(es.color)
                                            ]
                                        });
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                        return;
                                    } else if (collected.first().emoji.name) {
                                        client.settings.set(message.guild.id, collected.first().emoji.name, "suggestions.approveemoji");
                                        message.reply({
                                            embeds: [new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setColor(es.color)
                                            ]
                                        });
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                        return;
                                    } else {
                                        message.reply("EMOJI INVALIDO")
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                        return;
                                    }
                                } catch (e) {
                                    console.log(e)
                                }
                            } else {
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                throw "No has reaccionado con un Emoji"
                            }
                        }).catch(e => {
                            console.log(e)
                            return message.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(client.configbot.wrongcolor)
                                    .setFooter(data.footertext, data.footericon)
                                    .setTitle(`${client.allemojis.no} Tu tiempo ha expirado!`)
                                    .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                ]
                            });
                        })
                    }
                        break;

                    case "Emoji de Voto Negativo": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Cual debería de ser el ${optionhandletype}?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`Reacciona en **este mensaje**!`)
                            ]
                        })
                        const filter = (reaction, user) => {
                            return user.id == message.author.id;
                        };
                        tempmsg.awaitReactions({
                            filter,
                            max: 1,
                            time: 90000
                        }).then(collected => {
                            var reaction = collected.first()
                            if (reaction) {
                                try {
                                    if (collected.first().emoji.id && collected.first().emoji.id.length > 2) {
                                        client.settings.set(message.guild.id, collected.first().emoji.id, "suggestions.denyemoji");
                                        message.reply({
                                            embeds: [new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setColor(es.color)
                                            ]
                                        });
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                        return;
                                    } else if (collected.first().emoji.name) {
                                        client.settings.set(message.guild.id, collected.first().emoji.name, "suggestions.denyemoji");
                                        message.reply({
                                            embeds: [new Discord.MessageEmbed()
                                                .setTitle(`${client.allemojis.yes} Cambiado el ${optionhandletype}`)
                                                .setColor(es.color)
                                            ]
                                        });
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                        return;
                                    } else {
                                        message.reply("EMOJI INVALIDO")
                                        if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                        return;
                                    }
                                } catch (e) {
                                    console.log(e)
                                }
                            } else {
                                if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                throw "No has reaccionado con un Emoji"
                            }
                        }).catch(e => {
                            console.log(e)
                            return message.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setColor(client.configbot.wrongcolor)
                                    .setFooter(data.footertext, data.footericon)
                                    .setTitle(`${client.allemojis.no} Tu tiempo ha expirado!`)
                                    .setDescription(`${String(JSON.stringify(e)).substring(0, 2000)}`)
                                ]
                            });
                        })
                    }
                        break;

                    case "Reestablecer Configuración": {
                        var tempmsg = await message.reply({
                            embeds: [new MessageEmbed()
                                .setTitle(`Estás seguro de reestablecer los datos del sistema?`)
                                .setColor(es.color)
                                .setFooter({ text: es.footertext, iconURL: es.footericon })
                                .setDescription(`*Esto desactivará el sistema de sugerencias y restaurará toda su configuración por defecto!*`)
                            ],
                            components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setStyle("SUCCESS").setLabel("Sí").setEmoji(client.allemojis.yes).setCustomId("Sí"), new Discord.MessageButton().setStyle("DANGER").setLabel("No").setEmoji(client.allemojis.no).setCustomId("No")])]
                        })
                        //Create the collector
                        const collector = tempmsg.createMessageComponentCollector({
                            filter: i => i.isButton() && i.message.author.id == client.user.id && i.user,
                            time: 90000
                        })
                        //Menu Collections
                        collector.on('collect', button => {
                            if (button.user.id === cmduser.id) {
                                collector.stop();
                                if (button.customId == "No") return button.reply(`❌ Restauración cancelada!`)
                                if (button.customId == "Sí") {
                                    let defaultdata = {
                                        auto: true,
                                        channel: "",
                                        approvemsg: `${client.allemojis.yes} Idea aceptada!.`,
                                        denymsg: `${client.allemojis.no} Gracias por tu idea, pero no estamos interesados en este momento.`,
                                        maybemsg: `💡 Nos lo estamos pensando!`,
                                        statustext: `${client.allemojis.loading} En espera..., porfavor vota!`,
                                        soontext: `Pronto!`,
                                        footertext: `Quieres sugerir algo? Simplemente envíalo en este canal.`,
                                        approveemoji: client.allemojis.yes,
                                        denyemoji: client.allemojis.no,
                                    }
                                    client.settings.set(message.guild.id, defaultdata, "suggestions");
                                    message.reply({
                                        embeds: [new Discord.MessageEmbed()
                                            .setTitle(`${client.allemojis.yes} Configuración Reestablecida!`)
                                            .setColor(es.color)
                                        ]
                                    })
                                    if (GuildSettings.repeatsetupcmds) require(`./${require("path").parse(__filename).name}`).run(client, message, args, cmduser, text, prefix, client.settings.get(message.guild.id), client.settings.get(message.guild.id));
                                    return;
                                }
                                button.deferUpdate();
                            } else button.reply({
                                content: `${client.allemojis.no} No puedes hacer eso! Solo: <@${cmduser.id}>`,
                                ephemeral: true
                            });
                        });
                        //Once the Collections ended edit the menu message
                        collector.on('end', collected => {
                            tempmsg.edit({
                                embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)],
                                components: [],
                                content: `${collected && collected.first() && collected.first().customId ? `${client.allemojis.yes} **Seleccionado: \`${collected ? collected.first().customId : "Nothing"}\`**` : `${client.allemojis.no} **NADA SELECCIONADO - CANCELADO**`}`
                            })
                        });
                    }
                        break;


                }
            }

        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor).setFooter(client.getFooter(es))
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
