const { MessageEmbed } = require("discord.js");
const config = require(`../botconfig/config.json`);
const { duration, databasing } = require("../utils/funciones");
module.exports = client => {

  client.on("guildCreate", async guild => {
    if (!guild || guild.available === false) return;

    let theowner = "NO HAY DATOS DEL DUEÑO! ID:";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => { })

    databasing(client, guild.id)
    let embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`${client.allemojis.joined} Nuevo Servidor`)
      .addField("Servidor", `>>> \`\`\`${guild.name} (${guild.id})\`\`\``)
      .addField(`Antigüedad de Servidor`, `>>> \`\`\`${duration(Date.now() - guild.createdAt).map(d => d).slice(0, 3).join(", ")}\`\`\``)
      .addField("Dueño", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``)
      .addField(`Antigüedad de Cuenta de Dueño`, `>>> \`\`\`${duration(Date.now() - theowner.createdAt).map(d => d).slice(0, 3).join(", ")}\`\`\``)
      .addField("Cuenta de Miembros", `>>> \`\`\`${guild.memberCount}\`\`\``)
      .addField("Servidores en los que está el Bot", `>>> \`\`\`${client.guilds.cache.size}\`\`\``)
      .addField("Salirse del Servidor:", `>>> \`\`\`${config.prefix}leaveserver ${guild.id}\`\`\``)
      .setThumbnail(guild.iconURL({ dynamic: true }));
    for (const owner of config.ownerIDS) {
      //Si el Dueño es Dewstouh, y el Bot no está en el El Mundo de Niby, no enviar la información!
      if (owner == "282942681980862474") {
        let nibyGuild = client.guilds.cache.get("879397504075063297");
        if (nibyGuild && !nibyGuild.me.roles.cache.has("879397504075063297")) {
          continue;
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => { })
      }).catch(() => { });
    }
    //CHECK ANTIFAKESERVERS
    if (config.antifakeservers.enabled) {
      const logChannel = await client.channels.fetch(config.antifakeservers.logChannel).catch(() => null) || false;
      console.log("MEMEBER SERVERS CHECK")
      //check membercount first
      if (config.antifakeservers.minServerMembers !== 0 && config.antifakeservers.minServerMembers > guild.memberCount) {
        console.log("MEMBER COUNT LOW")
        guild.leave().then(g => {
          for (const owner of config.ownerIDS) {
            //Si el Dueño es Dewstouh, y el Bot no está en el El Mundo de Niby, no enviar la información!
            client.users.fetch(owner).then(user => {
              user.send({
                embeds: [new MessageEmbed()
                  .setTitle(`${client.allemojis.yes} Me he salido del Servidor \`${guild.name}\`!`)
                  .setDescription(`**RAZÓN:** Tiene menos de ${config.antifakeservers.minServerMembers}`)
                  .addField(`✏ Nombre`, `> \`${guild.name}\``)
                  .addField(`👑 ID de Dueño`, `> \`${guild.ownerId}\` | <@${guild.ownerId}>`)
                  .addField(`⌚ Antigüedad de Cuenta de Dueño`, `> <t:${Math.floor(theowner.createdAt / 1000)}:R>`)
                  .addField(`👤 Miembros`, `> \`${guild.memberCount} Miembros\``)
                  .addField(`🕐 Fecha de Creación`, `> <t:${Math.floor(guild.createdAt / 1000)}:R>`)
                  .setThumbnail(guild.iconURL({ dynamic: true }))
                  .setColor("GREEN")
                ]
              }).catch(() => { })
            }).catch(() => { });
          }
        })
        if (logChannel) logChannel.send({
          embeds: [new MessageEmbed()
            .setTitle(`${client.allemojis.yes} Me he salido del Servidor \`${guild.name}\`!`)
            .setDescription(`**RAZÓN:** Tiene menos de ${config.antifakeservers.minServerMembers}`)
            .addField(`✏ Nombre`, `> \`${guild.name}\``)
            .addField(`👑 ID de Dueño`, `> \`${guild.ownerId}\` | <@${guild.ownerId}>`)
            .addField(`⌚ Antigüedad de Cuenta de Dueño`, `> <t:${Math.floor(theowner.createdAt / 1000)}:R>`)
            .addField(`👤 Miembros`, `> \`${guild.memberCount} Miembros\``)
            .addField(`🕐 Fecha de Creación`, `> <t:${Math.floor(guild.createdAt / 1000)}:R>`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor("GREEN")
          ]
        }).catch(() => {})
        return;
      }
      console.log("MEMEBER BLACKLIST OWNERIDS CHECK")

      //check ownerIDS from blacklist
      if (config.antifakeservers.blacklistedOwnerIds.includes(guild.ownerId)) {
        console.log("BLACKLISTED OWNERID")

        guild.leave().then(g => {
          for (const owner of config.ownerIDS) {
            //Si el Dueño es Dewstouh, y el Bot no está en el El Mundo de Niby, no enviar la información!
            client.users.fetch(owner).then(user => {
              user.send({
                embeds: [new MessageEmbed()
                  .setTitle(`${client.allemojis.yes} Me he salido del Servidor \`${guild.name}\`!`)
                  .setDescription(`**RAZÓN:** ID de Dueño Prohibida`)
                  .addField(`✏ Nombre`, `> \`${guild.name}\``)
                  .addField(`👑 ID de Dueño`, `> \`${guild.ownerId}\` | <@${guild.ownerId}>`)
                  .addField(`⌚ Antigüedad de Cuenta de Dueño`, `> <t:${Math.floor(theowner.createdAt / 1000)}:R>`)
                  .addField(`👤 Miembros`, `> \`${guild.memberCount} Miembros\``)
                  .addField(`🕐 Fecha de Creación`, `> <t:${Math.floor(guild.createdAt / 1000)}:R>`)
                  .setThumbnail(guild.iconURL({ dynamic: true }))
                  .setColor("GREEN")
                ]
              }).catch(() => { })
            }).catch(() => { });
          }
        }).catch(() => {})
        if (logChannel) logChannel.send({
          embeds: [new MessageEmbed()
            .setTitle(`${client.allemojis.yes} Me he salido del Servidor \`${guild.name}\`!`)
            .setDescription(`**RAZÓN:** ID de Dueño Prohibida`)
            .addField(`✏ Nombre`, `> \`${guild.name}\``)
            .addField(`👑 ID de Dueño`, `> \`${guild.ownerId}\` | <@${guild.ownerId}>`)
            .addField(`⌚ Antigüedad de Cuenta de Dueño`, `> <t:${Math.floor(theowner.createdAt / 1000)}:R>`)
            .addField(`👤 Miembros`, `> \`${guild.memberCount} Miembros\``)
            .addField(`🕐 Fecha de Creación`, `> <t:${Math.floor(guild.createdAt / 1000)}:R>`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor("GREEN")
          ]
        }).catch(() => {})
        return;
      }
      console.log("MIN CREATION TIME CHECK")

      //check guild creation date
      if (Date.now() - new Date(guild.createdAt).getTime() < config.antifakeservers.minCreationTime) {
        console.log("GUILD CREATION LOW")
        guild.leave().then(g => {
          for (const owner of config.ownerIDS) {
            //Si el Dueño es Dewstouh, y el Bot no está en el El Mundo de Niby, no enviar la información!
            client.users.fetch(owner).then(user => {
              user.send({
                embeds: [new MessageEmbed()
                  .setTitle(`${client.allemojis.yes} Me he salido del Servidor \`${guild.name}\`!`)
                  .setDescription(`**RAZÓN:** Fecha de Creación menor a \`${duration(config.antifakeservers.minCreationTime).map(d => `\`${d}\``).join(", ")}\``)
                  .addField(`✏ Nombre`, `> \`${guild.name}\``)
                  .addField(`👑 ID de Dueño`, `> \`${guild.ownerId}\` | <@${guild.ownerId}>`)
                  .addField(`⌚ Antigüedad de Cuenta de Dueño`, `> <t:${Math.floor(theowner.createdAt / 1000)}:R>`)
                  .addField(`👤 Miembros`, `> \`${guild.memberCount} Miembros\``)
                  .addField(`🕐 Fecha de Creación`, `> <t:${Math.floor(guild.createdAt / 1000)}:R>`)
                  .setThumbnail(guild.iconURL({ dynamic: true }))
                  .setColor("GREEN")
                ]
              }).catch(() => { })
            }).catch(() => { });
          }
        }).catch(() => {})
        if (logChannel) logChannel.send({
          embeds: [new MessageEmbed()
            .setTitle(`${client.allemojis.yes} Me he salido del Servidor \`${guild.name}\`!`)
            .setDescription(`**RAZÓN:** Fecha de Creación menor a \`${duration(config.antifakeservers.minCreationTime).map(d => `\`${d}\``).join(", ")}\``)
            .addField(`✏ Nombre`, `> \`${guild.name}\``)
            .addField(`👑 ID de Dueño`, `> \`${guild.ownerId}\` | <@${guild.ownerId}>`)
            .addField(`⌚ Antigüedad de Cuenta de Dueño`, `> <t:${Math.floor(theowner.createdAt / 1000)}:R>`)
            .addField(`👤 Miembros`, `> \`${guild.memberCount} Miembros\``)
            .addField(`🕐 Fecha de Creación`, `> <t:${Math.floor(guild.createdAt / 1000)}:R>`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor("GREEN")
          ]
        }).catch(() => {})
        return;
      }
    }
  });

  client.on("guildDelete", async guild => {
    if (!guild || guild.available === false) return
    let theowner = "NO HAY DATOS DEL DUEÑO! ID:";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => { })
    let embed = new MessageEmbed()
      .setColor("RED")
      .setTitle(`${client.allemojis.left} Salido de Servidor`)
      .addField("Servidor", `>>> \`\`\`${guild.name} (${guild.id})\`\`\``)
      .addField(`Antigüedad de Servidor`, `>>> \`\`\`${duration(Date.now() - guild.createdAt).map(d => d).slice(0, 3).join(", ")}\`\`\``)
      .addField("Dueño", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``)
      .addField(`Antigüedad de Cuenta de Dueño`, `>>> \`\`\`${duration(Date.now() - theowner.createdAt).map(d => d).slice(0, 3).join(", ")}\`\`\``)
      .addField("Cuenta de Miembros", `>>> \`\`\`${guild.memberCount}\`\`\``)
      .addField("Servidores en los que está el Bot", `>>> \`\`\`${client.guilds.cache.size}\`\`\``)
      .setThumbnail(guild.iconURL({ dynamic: true }));
    for (const owner of config.ownerIDS) {
      //Si el Dueño es Dewstouh, y el Bot no está en el El Mundo de Niby, no enviar la información!
      if (owner == "282942681980862474") {
        let nibyGuild = client.guilds.cache.get("879397504075063297");
        if (nibyGuild && !nibyGuild.me.roles.cache.has("879397504075063297")) {
          continue;
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => { })
      }).catch(() => { });
    }
  });
}