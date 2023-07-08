const { glob } = require('glob');
const { promisify } = require('util');
const proGlob = promisify(glob);
module.exports = async client => {
        console.log(`(/) Cargando comandos`.yellow);
        await client.slashCommands.clear();
        client.slashArray = [];

        const RUTA_ARCHIVOS = await loadFiles("/slashCommands");

        if(RUTA_ARCHIVOS.length){
            RUTA_ARCHIVOS.forEach((rutaArchivo) => {
                try {
                    const COMANDO = require(rutaArchivo);
                    const NOMBRE_COMANDO = rutaArchivo.split("\\").pop().split("/").pop().split(".")[0];
                    COMANDO.CMD.name = NOMBRE_COMANDO;

                    if(NOMBRE_COMANDO) client.slashCommands.set(NOMBRE_COMANDO, COMANDO);

                    client.slashArray.push(COMANDO.CMD.toJSON());

                } catch(e){
                    console.log(`ERROR AL CARGAR EL ARCHIVO ${rutaArchivo}`.bgRed);
                    console.log(e);
                }
            })
        }

        console.log(`(/) ${client.slashCommands.size} Comandos Cargados`.green);

        if(client?.application?.commands){
            client.application.commands.set(client.slashArray);
            console.log(`(/) ${client.slashCommands.size} Comandos Publicados!`.green);
        }

        async function loadFiles(dirName){
            const ARCHIVOS = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`);
            ARCHIVOS.forEach((ARCHIVO) => delete require.cache[require.resolve(ARCHIVO)]);
            return ARCHIVOS;
        }

}