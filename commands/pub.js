const { MessageEmbed } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if (!args[0]) {
            message.channel.send("Veuillez entrer l'id d'un membre !")
            return;
        }

        connection.query(`SELECT * FROM pub WHERE idm = ?`, 
            [args[0]],
            function(err, results){
                if(err) throw err;
                if(results[0]){
                    results.forEach(e => {
                        client.channels.cache.get(constantes["pub"]).permissionOverwrites.get(e['idm']).delete();
                        connection.query(`DELETE FROM pub WHERE idm = ?`, [args[0]]);
                        message.channel.send(`L'interdiction de publicité a été levée pour <@${args[0]}>.`);
                    });
                }
            });

    }
    
exports.help = {
    name: "pub"
}
