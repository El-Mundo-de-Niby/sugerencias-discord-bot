const glob = require('glob');
const Discord = require('discord.js')
module.exports = {
    name: 'reload',
    desc: 'Recarga todos los comandos del Bot',
    owner: true,
    run: async (client, message, args, prefix, GuildSettings) => {

        let data = GuildSettings.embed;

        var msg = await message.reply({ embeds: [new Discord.MessageEmbed()
            .setColor(data.color)
            .setAuthor({name: "Recargando CMDS..", iconURL: "https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif"})
          ]});
          try {

              client.commands.sweep(() => true)
              glob(`${__dirname}/../**/*.js`, async(err, filePaths) =>{
                  if(err) return console.log(err)
                  filePaths.forEach((file) => {
                      delete require.cache[require.resolve(file)];
                      
                      const pull = require(file);
                      
                      if(pull.name) {
                          console.log(`Recargados ${pull.name} ✅`)
                          client.commands.set(pull.name, pull);
                        }
                        
                        if(pull.aliases && Array.isArray(pull.aliases)){
                            pull.aliases.forEach((alias) => {
                                client.aliases.set(alias, pull.name)
                            })
                        }
                    });
                    msg.edit({ embeds: [new Discord.MessageEmbed()
                        .setColor("#00FF00")
                        .setAuthor({name: `Recargados ${client.commands.size} CMDS`, iconURL: "https://cdn.discordapp.com/emojis/902121216859582514.gif?size=44"})
                    ]});
                });
            } catch {

            }
                
            }
        }