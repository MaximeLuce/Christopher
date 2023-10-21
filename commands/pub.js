const { Permissions } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'pub',
    aliases: [],
    description: 'Utilisation : &pub [identifiant] | Sans paramètre donne le temps restant avant de pouvoir écrire dans le salon vos-projets-pubs. Avec un identifiant, donne la permission au membre correspondant.',
    execute: async (client, message, args) => {
        const connection = []

        if (!message.member.roles.cache.has(constantes['sentinelle'])){
            connection.push(createConnection({
              host: config.connexion.host,
              user: config.connexion.user,
              password: config.connexion.password,
              database: config.connexion.database
            }));
            connection[0].query(`SELECT * FROM chris_pub WHERE idm = ?`, 
                [message.member.id],
                function(err, results){
                    if(err) {
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    };
                    if(results[0]){
                        results.forEach(e => {
                            const date = new Date(results[0]['moment']*1000+86400000);

                            let jour = ("0" + date.getDate()).slice(-2);
                            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                            let annee = date.getFullYear();
                            message.channel.send('Votre interdiction de publicité finira le '+jour+'/'+mois+'/'+annee+'.');
                        });
                    } else {
                        message.channel.send('Vous pouvez poster dans vos-projets-pubs !');
                    }
                });
            connection[0].end()
            connection.shift()
        } else {

            if (!args[0]) {
                return message.channel.send("Veuillez entrer l'id d'un membre !")
            }
            connection.push(createConnection({
              host: config.connexion.host,
              user: config.connexion.user,
              password: config.connexion.password,
              database: config.connexion.database
            }));
            connection[0].query(`SELECT * FROM chris_pub WHERE idm = ?`, 
                [args[0]],
                function(err, results){
                    if(err) {
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                    if(results[0]){
                        results.forEach(e => {
                            client.channels.cache.get(constantes["pub"]).permissionOverwrites.cache.get(e['idm']).delete();
                            connection.push(createConnection({
                              host: config.connexion.host,
                              user: config.connexion.user,
                              password: config.connexion.password,
                              database: config.connexion.database
                            }));
                            connection[0].query(`DELETE FROM chris_pub WHERE idm = ?`, 
                                [args[0]], 
                                function(err, results){
                                    if(err){
                                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                                            if(err) throw err;
                                        });
                                    }
                                })
                            connection[0].end()
                            connection.shift()
                            message.channel.send(`L'interdiction de publicité a été levée pour <@${args[0]}>.`)
                                .catch(function(err) {
                                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                                        if(err) throw err;
                                    });
                                });
                        });
                    } else
                        message.channel.send(`<@${args[0]}> peut déjà écrire dans vos-projets-pubs.`)
                            .catch(function(err) {
                                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                                    if(err) throw err;
                                });
                            });
                });
            connection[0].end()
            connection.shift()
        }
    }
}