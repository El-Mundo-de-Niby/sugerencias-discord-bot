const {inspect} = require('util');
const Discord = require('discord.js')
module.exports = {
    name: "eval",
    aliases: ["evaluar", "ejecutar"],
    desc: "Sirve para ejecutar código de Discord.js V13",
    run: async (client, message, args, prefix, GuildSettings) => {
        if(message.author.id !== "282942681980862474") return message.reply({
            embeds: [new Discord.MessageEmbed()
            .setTitle(`❌ Solo \`dewstouh#1088\` puede ejecutar este comando!`)
            .setColor(GuildSettings.embed.color)
            ]
        })

        if(!args.length) return message.reply(`❌ **Tienes que especificar un código para evaluar!**`);

        try {
            const evaluado = await eval(args.join(" "));
            const truncado = truncar(inspect(evaluado), 2045);
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`Evaluación`)
                .setDescription(`\`\`\`js\n${truncado}\`\`\``)
                .setColor(GuildSettings.embed.color)
                .setTimestamp()
            ]
            })
        } catch (e){
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                .setTitle(`Evaluación`)
                .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                .setColor("FF0000")
                .setTimestamp()
            ]
            })
        }
    }
}

function truncar(texto, n){
    if(texto.length > n){
        return texto.substring(0, n) + "..."
    } else {
        return texto;
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
