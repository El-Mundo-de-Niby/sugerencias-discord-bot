const Discord = require('discord.js');
const config = require('../botconfig/config.json');
const embed = require('../botconfig/embed.json');
module.exports = {
    paginacion,
    paginacion2,
    duration,
    dbEnsure,
    databasing,
    escapeRegex
}

function escapeRegex(str) {
    try {
      return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
}

function databasing(client, guildid) {
    if (!client || client == undefined || !client.user || client.user == undefined) return;
    try {
        dbEnsure(client.settings, guildid, {
            prefix: config.prefix,
            embed: {
                color: embed.color,
                thumb: true,
                wrongcolor: embed.wrongcolor,
                footertext: client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid).name : ee.footertext,
                footericon: client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid).iconURL({
                    dynamic: true
                }) : embed.footericon,
            },
            suggestions: {
                channel: null,
                auto: false,
                approvemsg: '<a:yes:929001012830806016> Idea aceptada!.',
                denymsg: '<:no:929001012478509077> Gracias por tu idea, pero no estamos interesados en este momento.',
                maybemsg: '💡 Nos lo estamos pensando!',
                statustext: '<a:loading:930045037390213170> En espera..., porfavor vota!',
                soontext: 'Pronto!',
                footertext: 'Quieres sugerir algo? Simplemente envíalo en este canal.',
                approveemoji: '<a:yes:929001012830806016>',
                denyemoji: '<:no:929001012478509077>'
            }
        })
    } catch (e) {
        console.log(e)
    }
}

function dbEnsure(db, key, data) {
    if (!db?.has(key)) {
        db?.ensure(key, data);
    } else {
        for (const [Okey, value] of Object.entries(data)) {
            if (!db?.has(key, Okey)) {
                db?.ensure(key, value, Okey);
            } else {
            }
        }
    }
}

//definimos la funcion de paginación
async function paginacion(client, message, texto, titulo = "Paginación", elementos_por_pagina = 5) {

    /* DIVIDIMOS EL TEXTO PARA CREAR LAS PAGINAS Y EMPUJARLO EN LOS EMBEDS */

    var embeds = [];
    var dividido = elementos_por_pagina;
    for (let i = 0; i < texto.length; i += dividido) {
        let desc = texto.slice(i, elementos_por_pagina);
        elementos_por_pagina += dividido;
        //creamos un embed por cada pagina de los datos divididos
        let embed = new Discord.MessageEmbed()
            .setTitle(titulo.toString())
            .setDescription(desc.join(" "))
            .setColor(GuildSettings.embed.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        embeds.push(embed)
    }

    let paginaActual = 0;
    //Si la cantidad de embeds es solo 1, envíamos el mensaje tal cual sin botones
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });
    //Si el numero de embeds es mayor 1, hacemos el resto || definimos los botones.
    let boton_atras = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Atrás').setEmoji('929001012176507040').setLabel('Atrás')
    let boton_inicio = new Discord.MessageButton().setStyle('DANGER').setCustomId('Inicio').setEmoji('🏠').setLabel('Inicio')
    let boton_avanzar = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('Avanzar').setEmoji('929001012461707335').setLabel('Avanzar')
    //Enviamos el mensaje embed con los botones
    let embedpaginas = await message.channel.send({
        content: `**Haz click en los __Botones__ para cambiar de páginas**`,
        embeds: [embeds[0].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
        components: [new Discord.MessageActionRow().addComponents([boton_atras, boton_inicio, boton_avanzar])]
    });
    //is interaction
    if (message.user) await message.reply({ content: "_ _" }).catch(() => { })
    //Creamos un collector y filtramos que la persona que haga click al botón, sea la misma que ha puesto el comando, y que el autor del mensaje de las páginas, sea el cliente
    const collector = embedpaginas.createMessageComponentCollector({ filter: i => i?.isButton() && i?.user && i?.user.id == message.member.id && i?.message.member.id == client.user.id, time: 180e3 });
    //Escuchamos los eventos del collector
    collector.on("collect", async b => {
        //Si el usuario que hace clic a el botón no es el mismo que ha escrito el comando, le respondemos que solo la persona que ha escrito >>queue puede cambiar de páginas
        if (b?.user.id !== message.member.id) return b?.reply({ content: `❌ **Solo la persona que ha escrito \`${prefix}queue\` puede cambiar de páginas!` });

        switch (b?.customId) {
            case "Atrás": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                if (paginaActual !== 0) {
                    //Resetemamos el valor de pagina actual -1
                    paginaActual -= 1
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                } else {
                    //Reseteamos al cantidad de embeds - 1
                    paginaActual = embeds.length - 1
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            case "Inicio": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                paginaActual = 0;
                await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                await b?.deferUpdate();
            }
                break;

            case "Avanzar": {
                //Resetemamos el tiempo del collector
                collector.resetTimer();
                //Si la pagina a avanzar no es la ultima, entonces avanzamos una página
                if (paginaActual < embeds.length - 1) {
                    //Aumentamos el valor de pagina actual +1
                    paginaActual++
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                    //En caso de que sea la ultima, volvemos a la primera
                } else {
                    //Reseteamos al cantidad de embeds - 1
                    paginaActual = 0
                    //Editamos el embeds
                    await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                    await b?.deferUpdate();
                }
            }
                break;

            default:
                break;
        }
    });
    collector.on("end", () => {
        //desactivamos los botones y editamos el mensaje
        embedpaginas.components[0].components.map(boton => boton.disabled = true)
        embedpaginas.edit({ content: `El tiempo ha expirado!`, embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
    });
}

async function paginacion2(client, message, embeds) {
    let currentPage = 0;
    let cmduser = message.member
    if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
    let button_back = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Atrás")
    let button_home = new Discord.MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Inicio")
    let button_forward = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Avanzar")
    const allbuttons = [new Discord.MessageActionRow().addComponents([button_back, button_home, button_forward])]
    //Send message with buttons
    let swapmsg = await message.channel.send({
        content: `***Haz Click en los __Botones__ para Cambiar de Páginas***`,
        embeds: [embeds[0]],
        components: allbuttons
    });
    //is interaction
    if (message.user) await message.reply({ content: "_ _" }).catch(() => { })
    //create a collector for the thinggy
    const collector = swapmsg.createMessageComponentCollector({ filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.member.id == client.user.id, time: 180e3 }); //collector for 5 seconds
    //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
    collector.on('collect', async b => {
        if (b?.user.id !== message.member.id)
            return b?.reply({ content: `❌ **Solo la persona que ha ejecutado el comando puede usar los botones!**`, ephemeral: true })
        //page forward
        if (b?.customId == "1") {
            //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage !== 0) {
                currentPage -= 1
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons });
                await b?.deferUpdate();
            } else {
                currentPage = embeds.length - 1
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons });
                await b?.deferUpdate();
            }
        }
        //go home
        else if (b?.customId == "2") {
            //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
            currentPage = 0;
            await swapmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons });
            await b?.deferUpdate();
        }
        //go forward
        else if (b?.customId == "3") {
            //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage < embeds.length - 1) {
                currentPage++;
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons });
                await b?.deferUpdate();
            } else {
                currentPage = 0
                await swapmsg.edit({ embeds: [embeds[currentPage]], components: allbuttons });
                await b?.deferUpdate();
            }

        }
    });

}

function duration(duration, useMilli = false) {
    let remain = duration;
    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
    let milliseconds = remain;
    let time = {
        days,
        hours,
        minutes,
        seconds,
        milliseconds
    };
    let parts = []
    if (time.days) {
        let ret = time.days + ' Día'
        if (time.days !== 1) {
            ret += 's'
        }
        parts.push(ret)
    }
    if (time.hours) {
        let ret = time.hours + ' Hora'
        if (time.hours !== 1) {
            ret += 's'
        }
        parts.push(ret)
    }
    if (time.minutes) {
        let ret = time.minutes + ' Min'
        if (time.minutes !== 1) {
            ret += 's'
        }
        parts.push(ret)

    }
    if (time.seconds) {
        let ret = time.seconds + ' Seg'
        if (time.seconds !== 1) {
            ret += 's'
        }
        parts.push(ret)
    }
    if (useMilli && time.milliseconds) {
        let ret = time.milliseconds + ' ms'
        parts.push(ret)
    }
    if (parts.length === 0) {
        return ['1s']
    } else {
        return parts
    }
}

/*
╔═════════════════════════════════════════════════════╗
║    || - || Desarollado por dewstouh#1088 || - ||    ║
║    ----------| discord.gg/MBPsvcphGf |----------    ║
╚═════════════════════════════════════════════════════╝
*/
