const config = require('../../botconfig/config.json')
module.exports = client => {
    let palo = 53;
    console.log(`╔═════════════════════════════════════════════════════╗`.green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`║ `.green + `      Conectado como ${client.user.tag}`.green + " ".repeat(-1 + palo - 1 - `      Conectado como ${client.user.tag}`.length) + " ║".green)
    console.log(`║ `.green + " ".repeat(-1 + palo - 1) + " ║".green)
    console.log(`╚═════════════════════════════════════════════════════╝`.green)

    let index = 0;
    client.user.setActivity(config.status[index].text.replace(/{suggestcount}/, client.suggestions?.size ?? 0), { type: config.status[index].type });

    if(client?.application?.commands){
        client.application.commands.set(client.slashArray);
        console.log(`(/) ${client.slashCommands.size} Comandos Publicados!`.green);
    }

    //start the interval
    setInterval(() => {
        if(index+1 > config.status.length) index = 0;
        client.user.setActivity(config.status[index].text.replace(/{suggestcount}/, client.suggestions?.size ?? 0), { type: config.status[index].type });
        index++;
    }, 90000);
}