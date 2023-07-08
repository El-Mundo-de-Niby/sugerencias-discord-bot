const Discord = require('discord.js')
const { Permissions, MessageEmbed } = require('discord.js')
const { dbEnsure } = require(`${process.cwd()}/utils/funciones`);
module.exports = {
  name: `suggestion`,
  category: "🚫 Administration",
  aliases: [`sugerencia`, `sugestion`],
  desc: `Administra el estado de una Sugerencia!`,
  usage: `sugerencia <aceptar/rechazar/quizá/pronto/duplicada> <ID_SUGERENCIA> [Razón]`,
  type: "server",
  run: async (client, message, args, prefix, GuildSettings) => {
    let es = GuildSettings.embed;

    let adminroles = GuildSettings.adminroles || []
    let cmdroles = GuildSettings.cmdadminroles?.[`${require("path").parse(__filename).name}`] || []

    if (!cmdroles) {
      dbEnsure(client.settings, message.guild.id, {
        [`cmdadminroles.${require("path").parse(__filename).name}`]: []
      })
      cmdroles = [];
    }
    var cmdrole = []
    if (cmdroles.length > 0) {
      for (const r of cmdroles) {
        if (message.guild.roles.cache.get(r)) {
          cmdrole.push(` | <@&${r}>`)
        }
        else if (message.guild.members.cache.get(r)) {
          cmdrole.push(` | <@${r}>`)
        }
        else {
          client.settings.remove(message.guild.id, r, `cmdadminroles.suggest`)
        }
      }
    }
    if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, client.configbot.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter("RED")
          .setTitle(`${client.allemojis.no} No tienes permitido ejecutar este comando!`)
          .setDescription(`${adminroles.length > 0 ? "Necesitas uno de los siguientes Roles: " + adminroles.map(role => `<@&${role}>`).join(" | ") + cmdrole.join("") : `No hay Roles de Administración Configurados! Configúralos con: \`${prefix}setup-admin\``}`)
        ]
      }).catch(() => { });
    var approveemoji = GuildSettings.suggestions.approveemoji;
    var denyemoji = GuildSettings.suggestions.denyemoji;
    var approvetext = GuildSettings.suggestions.approvemsg;
    var denytext = GuildSettings.suggestions.denymsg;
    var maybetext = GuildSettings.suggestions.maybemsg;
    var soontext = GuildSettings.suggestions.soontext;
    var prefix = GuildSettings.prefix;
    var feedbackchannel = GuildSettings.suggestions.channel;
    let whovotedbtn = new Discord.MessageButton().setStyle('PRIMARY').setEmoji("❓").setLabel("Quien ha votado?").setCustomId("whovoted");
    /*if (!feedbackchannel) return message.reply({embeds: [
      new Discord.MessageEmbed()
      .setTitle(`${client.allemojis.no} No hay un Sistema de Sugerencias configurado!`)
      .setDescription(`Puedes configurarlo usando: \`${prefix}setup-suggestion\``)
      .setColor(es.wrongcolor)
    ]});*/
    if (!args[0]) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle(`${client.allemojis.no} No has especificado el método!`)
        .setColor(es.wrongcolor)
        .setDescription(`Uso: \`${prefix}sugerencia <aceptar/rechazar/quizá/pronto/duplicada> <ID_SUGERENCIA> [Razón]\``)
        .setFooter({ text: es.footertext, iconURL: es.footericon })
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        }))
      ]
    })
    if (!["accept", "approve", "deny", "maybe", "soon", "duplicate", "duplicated", "reset", "aceptar", "rechazar", "aprobar", "aprovar", "denegar", "quizá", "pronto", "duplicada", "duplicado", "resetear", "reestablecer", "restablecer"].includes(args[0]) || !args.length || !args[0]) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle(`${client.allemojis.no} No has especificado el método!`)
        .setColor(es.wrongcolor)
        .setDescription(`Uso: \`${prefix}sugerencia <aceptar/rechazar/quizá/pronto/duplicada> <ID_SUGERENCIA> [Razón]\``)
        .setFooter({ text: es.footertext, iconURL: es.footericon })
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        }))
      ]
    })
    if (!args[1]) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle(`${client.allemojis.no} No has especificado la ID de la Sugerencia!`)
        .setColor(es.wrongcolor)
        .setDescription(`Uso: \`${prefix}sugerencia <aceptar/rechazar/quizá/pronto/duplicada> <ID_SUGERENCIA> [Razón]\``)
        .setFooter({ text: es.footertext, iconURL: es.footericon })
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        }))
      ]
    })
    try {
      var msg = await message.guild.channels.cache.get(feedbackchannel).messages.fetch(args[1]);
    } catch {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setTitle(`${client.allemojis.no} Esa sugerencia no existe!`)
          .setColor(es.wrongcolor)
          .setDescription(`Uso: \`${prefix}sugerencia <aceptar/rechazar/quizá/pronto/duplicada> <ID_SUGERENCIA> [Razón]\``)
          .setFooter({ text: es.footertext, iconURL: es.footericon })
          .setThumbnail(message.guild.iconURL({
            dynamic: true
          }))
        ]
      });
    }
    let suggestion = client.suggestions.get(args[1]);
    if (!suggestion) return message.reply({
      embeds: [new Discord.MessageEmbed()
        .setTitle(`${client.allemojis.no} Esa sugerencia no existe!`)
        .setColor(es.wrongcolor)
        .setDescription(`Uso: \`${prefix}sugerencia <aceptar/rechazar/quizá/pronto/duplicada> <ID_SUGERENCIA> [Razón]\``)
        .setFooter({ text: es.footertext, iconURL: es.footericon })
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        }))
      ]
    });
    var acceptbtn = new Discord.MessageButton().setStyle('SECONDARY').setEmoji(approveemoji).setLabel(suggestion.peopleupvoted.length.toString()).setCustomId("voteyes");
    var denybtn = new Discord.MessageButton().setStyle('SECONDARY').setEmoji(denyemoji).setLabel(suggestion.peopledownvoted.length.toString()).setCustomId("voteno");
    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No reason";


    switch (args[0]) {
      case "accept":
      case "aceptar":
      case "aprobar":
      case "approve": {
        msg.embeds[0].color = "GREEN";
        msg.embeds[0].fields[0].name = `${client.allemojis.flechader} **__Aceptada por ${message.author.tag}__**`;
        msg.embeds[0].fields[0].value = `> ${reason}`;
        msg.embeds[0].fields.splice(1, 1)
        msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.MessageActionRow().addComponents([whovotedbtn])] });
        try {
          message.guild.members.cache.get(suggestion.author).send({ content: `Tu Sugerencia en **${message.guild.name}** ha sido \`Aceptada\`\n> https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]}\n\n${approvetext}`, embeds: [msg.embeds[0]] })
        } catch { }
        message.reply({
          embeds: [
            new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} **| Sugerencia \`Aceptada\`**`)
              .setColor(es.color)
              .setDescription(`<#${feedbackchannel}> | [\`ID DE MENSAJE\`](https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]})`)
          ]
        })
      }
        break;

      case "rechazar":
      case "denegar":
      case "deny": {
        msg.embeds[0].color = es.wrongcolor;
        msg.embeds[0].fields[0].name = `${client.allemojis.flechader} **__Rechazada por ${message.author.tag}__**`;
        msg.embeds[0].fields[0].value = `> ${reason}`;
        msg.embeds[0].fields.splice(1, 1)
        msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.MessageActionRow().addComponents([whovotedbtn])] });
        try {
          message.guild.members.cache.get(suggestion.author).send({ content: `Tu Sugerencia en **${message.guild.name}** ha sido \`Rechazada\`\n> https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]}\n\n${denytext}`, embeds: [msg.embeds[0]] })
        } catch { }
        message.reply({
          embeds: [
            new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} **| Sugerencia \`Rechazada\`**`)
              .setColor(es.color)
              .setDescription(`<#${feedbackchannel}> | [\`ID DE MENSAJE\`](https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]})`)
          ]
        })
      }
        break;

      case "quiza":
      case "quizá":
      case "quizás":
      case "quizas":
      case "maybe": {
        msg.embeds[0].color = "ORANGE";
        msg.embeds[0].fields[0].name = `${client.allemojis.flechader} **__En decisión por ${message.author.tag}__**`;
        msg.embeds[0].fields[0].value = `> ${reason}`;
        msg.embeds[0].fields.splice(1, 1)
        msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.MessageActionRow().addComponents([whovotedbtn])] });
        try {
          message.guild.members.cache.get(suggestion.author).send({ content: `Tu Sugerencia en **${message.guild.name}** ha sido establecida como \`En Decisión\`\n> https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]}\n\n${maybetext}`, embeds: [msg.embeds[0]] })
        } catch { }
        message.reply({
          embeds: [
            new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} **| Sugerencia establecida como \`En Decisión\`**`)
              .setColor(es.color)
              .setDescription(`<#${feedbackchannel}> | [\`ID DE MENSAJE\`](https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]})`)
          ]
        })
      }
        break;

      case "pronto":
      case "soon": {
        msg.embeds[0].color = "WHITE";
        msg.embeds[0].fields[0].name = `${client.allemojis.flechader} **__Próximamente por ${message.author.tag}__**`;
        msg.embeds[0].fields[0].value = `> ${reason}`;
        msg.embeds[0].fields.splice(1, 1)
        msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.MessageActionRow().addComponents([whovotedbtn])] });
        try {
          message.guild.members.cache.get(suggestion.author).send({ content: `Tu Sugerencia en **${message.guild.name}** ha sido establecida como \`Próximamente\`\n> https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]}\n\n${soontext}`, embeds: [msg.embeds[0]] })
        } catch { }
        message.reply({
          embeds: [
            new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} **| Sugerencia establecida como \`Próximamente\`**`)
              .setColor(es.color)
              .setDescription(`<#${feedbackchannel}> | [\`ID DE MENSAJE\`](https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]})`)
          ]
        })
      }
        break;

      case "duplicada":
      case "duplicado":
      case "duplicated":
      case "duplicate": {
        msg.embeds[0].color = "BLUE";
        msg.embeds[0].fields[0].name = `${client.allemojis.flechader} **__Duplicada por ${message.author.tag}__**`;
        msg.embeds[0].fields[0].value = `> ${reason}`;
        msg.embeds[0].fields.splice(1, 1)
        msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.MessageActionRow().addComponents([whovotedbtn])] });
        try {
          message.guild.members.cache.get(suggestion.author).send({ content: `Tu Sugerencia en **${message.guild.name}** está \`Duplicada\`\n> https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]}`, embeds: [msg.embeds[0]] })
        } catch { }

        message.reply({
          embeds: [
            new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} **| Sugerencia \`Duplicada\`**`)
              .setColor(es.color)
              .setDescription(`<#${feedbackchannel}> | [\`ID DE MENSAJE\`](https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]})`)
          ]
        })
      }
        break;

      case "reestablecer":
      case "resetear":
      case "restablecer":
      case "reset": {
        msg.embeds[0].color = es.color;
        msg.embeds[0].fields[0].name = `👍 **__Votos Positivos | ${Math.round((suggestion.peopleupvoted.length * 100) / (suggestion.peopleupvoted.length + suggestion.peopledownvoted.length))}%__**`;
        msg.embeds[0].fields[0].value = `**\`\`\`${suggestion.peopleupvoted.length.toString()} Votes\`\`\`**`;
        msg.embeds[0].fields[0].inline = true;
        if (!msg.embeds[0].fields[1]) {
          msg.embeds[0].fields.push({
            name: `👎 **__Votos Negativos__**`,
            value: `**\`\`\`${suggestion.peopledownvoted.length.toString()} Votes\`\`\`**`,
            inline: true
          });
        } else {
          msg.embeds[0].fields[1].name = `👎 **__Votos Negativos | ${Math.round((suggestion.peopledownvoted.length * 100) / (suggestion.peopleupvoted.length + suggestion.peopledownvoted.length))}%__**`;
          msg.embeds[0].fields[1].value = `**\`\`\`${suggestion.peopleupvoted.length.toString()} Votes\`\`\`**`;
          msg.embeds[0].fields[1].inline = true;
        }
        msg.edit({ embeds: [msg.embeds[0]], components: [new Discord.MessageActionRow().addComponents([acceptbtn, denybtn, whovotedbtn])] });

        message.reply({
          embeds: [
            new Discord.MessageEmbed().setTitle(`${client.allemojis.yes} **| Sugerencia \`Reestablecida\`**`)
              .setColor(es.color)
              .setDescription(`<#${feedbackchannel}> | [\`ID DE MENSAJE\`](https://discord.com/channels/${message.guild.id}/${feedbackchannel}/${args[1]})`)
          ]
        })
      }

      default:
        break;
    }
  }
}