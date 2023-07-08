const { MessageEmbed } = require(`discord.js`);
const { dbEnsure } = require(`${process.cwd()}/utils/funciones`)
const Discord = require('discord.js');

  module.exports.messageCreate = async (client, message, GuildSettings) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.partial) await message.fetch();

    //////////////////////////////////////////
    //////////////////////////////////////////
    /////////////FEEDBACK SYSTEM//////////////
    //////////////////////////////////////////
    //////////////////////////////////////////
    if(!GuildSettings.suggestions) dbEnsure(client.settings, message.guild.id, {
        suggestions: {
            enabled: false,
            channel: "",
            approvemsg: `${client.allemojis.yes} Idea Aceptada!.`,
            denymsg: `${client.allemojis.no} Gracias por tu idea, pero no estamos interesados en este momento.`,
            maybemsg: `💡 Nos lo estamos pensando!`,
            statustext: `${client.allemojis.loading} Esperando votación de la comunidad!`,
            soontext: `Pronto!`,
            footertext: `Quieres sugerir algo? Envíalo en este canal!`,
            approveemoji: client.allemojis.yes,
            denyemoji: client.allemojis.no,
          }
    });
    let SuggestionData = GuildSettings.suggestions;
    var approveemoji = SuggestionData.approveemoji;
    var denyemoji = SuggestionData.denyemoji;
    var footertext = SuggestionData.footertext;
    var feedbackchannel = SuggestionData.channel;

    var acceptbtn = new Discord.MessageButton().setStyle('SECONDARY').setEmoji(approveemoji).setLabel("0").setCustomId("voteyes");
    var denybtn = new Discord.MessageButton().setStyle('SECONDARY').setEmoji(denyemoji).setLabel("0").setCustomId("voteno");
    let whovotedbtn = new Discord.MessageButton().setStyle('PRIMARY').setEmoji("❓").setLabel("Quien ha votado?").setCustomId("whovoted");

    if(!feedbackchannel) return;
    if (message.channel.id === feedbackchannel) {
      var es = GuildSettings.embed;
      var url = ``;
      var imagename = `Unknown`;
      message.delete();
      var embed = new MessageEmbed()
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
      .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
      .setAuthor({name: `Sugerencia de ${message.author.tag}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }), url: client.configbot.discord})
      .setFooter(footertext, "https://images-ext-2.discordapp.net/external/cmLyY8QghL2jzz_M435JYnCGgoOiChBFP9-4oOWFizE/https/emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/light-bulb_1f4a1.png")
      .addField(`👍 **__Votos Positivos | 0%__**`, `**\`\`\`0 Votos\`\`\`**`, true)
      .addField(`👎 **__Votos Negativos | 0%__**`, `**\`\`\`0 Votos\`\`\`**`, true)
      if(message.content) embed.setDescription(">>> "+ message.content)
      if (message.attachments.size > 0)
        if (message.attachments.every(attachIsImage)) {
          embed.setImage(message.attachments.first().attachment)
        }
      let msg = await message.channel.send({embeds: [embed], components: [new Discord.MessageActionRow().addComponents([acceptbtn, denybtn, whovotedbtn])]})
      dbEnsure(client.suggestions, msg.id, {
        author: message.author.id,
        peopleupvoted: [],
        peopledownvoted: [],
      });
    }
  }

  module.exports.interactionCreate = async (client, interaction) => {
    if(!interaction.isButton() || !interaction.guildId || interaction.message.author.id != client.user.id) return;

    try {
      switch (interaction.customId) {
        case "voteyes": {
          let data = client.suggestions.get(interaction.message.id);
          
          try {
            client.suggestions.remove(interaction.message.id, (v) => v === interaction.member.user.id, "peopledownvoted");
            if(client.suggestions.get(interaction.message.id, "peopleupvoted").some(v => v === interaction.member.user.id)) return interaction.reply({
              content: `No puedes votar la sugerencia de <@${data.author}> dos veces!`,
              allowedMentions: {
                parse: ['users'],
              },
              ephemeral: true
            });
            client.suggestions.push(interaction.message.id, interaction.member.user.id, "peopleupvoted");
          } catch (e) {console.log(e)}
          
          data = client.suggestions.get(interaction.message.id);

          interaction.message.embeds[0].fields[0].name = `👍 **__Votos Positivos | ${Math.round((data.peopleupvoted.length * 100) / (data.peopleupvoted.length + data.peopledownvoted.length))}%__**`, `**\`\`\`0 Votos\`\`\`**`
          interaction.message.embeds[0].fields[1].name = `👎 **__Votos Negativos | ${Math.round((data.peopledownvoted.length * 100) / (data.peopleupvoted.length + data.peopledownvoted.length))}%__**`, `**\`\`\`0 Votos\`\`\`**`
          interaction.message.embeds[0].fields[0].value = `**\`\`\`${data.peopleupvoted.length.toString()} Votos\`\`\`**`
          interaction.message.embeds[0].fields[1].value = `**\`\`\`${data.peopledownvoted.length.toString()} Votos\`\`\`**`
          interaction.message.components[0].components[0].label = client.suggestions.get(interaction.message.id, "peopleupvoted").length.toString()
          interaction.message.components[0].components[1].label = client.suggestions.get(interaction.message.id, "peopledownvoted").length.toString()
          interaction.message.edit({embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]]})
          interaction.deferUpdate();
        }
        break;

        case "voteno": {
          let data = client.suggestions.get(interaction.message.id);
          
          try {
            client.suggestions.remove(interaction.message.id, (v) => v === interaction.member.user.id, "peopleupvoted");
            if(client.suggestions.get(interaction.message.id, "peopledownvoted").some(v => v === interaction.member.user.id)) return interaction.reply({
              content: `No puedes votar la sugerencia de <@${data.author}> dos veces!`,
              allowedMentions: {
                parse: ['users'],
              },
              ephemeral: true
            });
            client.suggestions.push(interaction.message.id, interaction.member.user.id, "peopledownvoted");
          } catch (e) {console.log(e)}
          
          data = client.suggestions.get(interaction.message.id);
  
          interaction.message.embeds[0].fields[0].name = `👍 **__Votos Positivos | ${Math.round((data.peopleupvoted.length * 100) / (data.peopleupvoted.length + data.peopledownvoted.length))}%__**`, `**\`\`\`0 Votos\`\`\`**`
          interaction.message.embeds[0].fields[1].name = `👎 **__Votos Negativos | ${Math.round((data.peopledownvoted.length * 100) / (data.peopleupvoted.length + data.peopledownvoted.length))}%__**`, `**\`\`\`0 Votos\`\`\`**`
          interaction.message.embeds[0].fields[0].value = `**\`\`\`${data.peopleupvoted.length.toString()} Votos\`\`\`**`
          interaction.message.embeds[0].fields[1].value = `**\`\`\`${data.peopledownvoted.length.toString()} Votos\`\`\`**`
          interaction.message.components[0].components[0].label = client.suggestions.get(interaction.message.id, "peopleupvoted").length.toString()
          interaction.message.components[0].components[1].label = client.suggestions.get(interaction.message.id, "peopledownvoted").length.toString()
          interaction.message.edit({embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0]]})
          interaction.deferUpdate();
        }
        break;

        case "whovoted": {
          let data = client.suggestions.get(interaction.message.id);
          let es = client.settings.get(interaction.guild.id, "embed")

          await interaction.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`❓ **Quien ha votado?** ❓`)
            .addField(`${data.peopleupvoted.length.toString()} Votos Positivos`, data.peopleupvoted.length >= 1 ? `${data.peopleupvoted.length < 20 ? data.peopleupvoted.map(u => `<@${u}>`).join("\n") : [...data.peopleupvoted.slice(0, 20).map(r => `<@${r}>`), `${data.peopleupvoted.length - 20} más...`].join("\n")}` : `Nadie`, true)
            .addField(`${data.peopledownvoted.length.toString()} Votos Negativos`, data.peopledownvoted.length >= 1 ? `${data.peopledownvoted.length < 20 ? data.peopledownvoted.map(u => `<@${u}>`).join("\n") : [...data.peopledownvoted.slice(0, 20).map(r => `<@${r}>`), `${data.peopledownvoted.length - 20} más...`].join("\n")}` : `Nadie`, true)
            .setColor(es.color)
            ]
          , ephemeral: true})
        }
        break;
        
        default:
          break;
        }
        
      } catch(e) {console.log(e)}
  }

  
  function attachIsImage(msgAttach) {
    url = msgAttach.url;
    imagename = msgAttach.name || `Unknown`;
    return url.indexOf(`png`, url.length - `png`.length /*or 3*/ ) !== -1 ||
      url.indexOf(`jpeg`, url.length - `jpeg`.length /*or 3*/ ) !== -1 ||
      url.indexOf(`gif`, url.length - `gif`.length /*or 3*/ ) !== -1 ||
      url.indexOf(`jpg`, url.length - `jpg`.length /*or 3*/ ) !== -1;
  }

