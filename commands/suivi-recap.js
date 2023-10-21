const { Permissions } = require('discord.js');
const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'suivi-recap',
    aliases: ['suivi-r'],
    description: 'Utilisation : &suivi-recap date/type/identifiant | Affiche un récapitulatif des actes de modération d\'un même type, vers une même personne ou d\'une même date au format JJ/MM/AAAA.',
    execute: async (client, message, args) => {
        const connection = []

        if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if (!args[0]) return message.channel.send('Il va me falloir un paramètre : date (jj/mm/aaaa), id de membre ou type de sanction !');

        const arg = args[0];

        let tab = ["autre", "avertissement", "mute", "kick", "ban", "suppression"];


        if(parseInt(arg, 10) == arg){
            connection.push(createConnection({
                host: config.connexion.host,
                user: config.connexion.user,
                password: config.connexion.password,
                database: config.connexion.database
              }));
            connection[0].query(
                `SELECT * FROM commun_suivi WHERE membre = ?`,
                [arg],
                async function(err, results) {
                    if(err){
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                    if(results.length === 0){
                        message.channel.send('Aucun résultat.')
                          .catch(function(err) {
                            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                              if(err) throw err;
                            });
                          });
                    } else {
                        results.forEach(e => {
                            affType = tab[e.type];
                            affType = affType[0].toUpperCase()+affType.slice(1);
                            const date = new Date(e.date*1000);
                            let jour = ("0" + date.getDate()).slice(-2);
                            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                            let heure = ("0" + date.getHours()).slice(-2);
                            let minute = ("0" + date.getMinutes()).slice(-2);
                            let secondes = ("0" + date.getSeconds()).slice(-2);
                            affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;
                            message.channel.send('**['+affType+' - <@'+e.modo+'>]** '+affTime+', <@'+e.membre+'> : '+e.motif);
                        })
                          .catch(function(err) {
                            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                              if(err) throw err;
                            });
                          })
                    }
                }
            )
            connection[0].end()
            connection.shift()
        } else if(tab.includes(arg)) {
            connection.push(createConnection({
                host: config.connexion.host,
                user: config.connexion.user,
                password: config.connexion.password,
                database: config.connexion.database
              }));
            connection[0].query(
                `SELECT * FROM commun_suivi WHERE type = ?`, 
                [tab.indexOf(arg)],
                async function(err, results) {
                    if(err){
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                    if(results.length === 0){
                        message.channel.send('Aucun résultat.');
                    } else {
                        results.forEach(e => {
                            affType = tab[e.type];
                            affType = affType[0].toUpperCase()+affType.slice(1);
                            const date = new Date(e.date*1000);
                            let jour = ("0" + date.getDate()).slice(-2);
                            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                            let heure = ("0" + date.getHours()).slice(-2);
                            let minute = ("0" + date.getMinutes()).slice(-2);
                            let secondes = ("0" + date.getSeconds()).slice(-2);
                            affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;
                            message.channel.send('**['+affType+' - <@'+e.modo+'>]** '+affTime+', <@'+e.membre+'> : '+e.motif);
                        })
                          .catch(function(err) {
                            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                              if(err) throw err;
                            });
                          })                        
                    }
                }
            )
            connection[0].end()
            connection.shift();
        } else {
            let myDate = arg.split('/');
            let myTime = new Date(myDate[2], myDate[1] - 1, myDate[0]).getTime();
            let mintime = Math.round(myTime/1000);
            let maxtime = mintime+86400;
            connection.push(createConnection({
                host: config.connexion.host,
                user: config.connexion.user,
                password: config.connexion.password,
                database: config.connexion.database
              }));
            connection[0].query(
                `SELECT * FROM commun_suivi WHERE date < ? AND date > ?`,
                [maxtime, mintime],
                async function(err, results) {
                    if(err){
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                    if(!results || results.length === 0){
                        message.channel.send('Aucun résultat.');
                    } else {
                        results.forEach(e => {
                            affType = tab[e.type];
                            affType = affType[0].toUpperCase()+affType.slice(1);
                            const date = new Date(e.date*1000);
                            let jour = ("0" + date.getDate()).slice(-2);
                            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                            let heure = ("0" + date.getHours()).slice(-2);
                            let minute = ("0" + date.getMinutes()).slice(-2);
                            let secondes = ("0" + date.getSeconds()).slice(-2);
                            affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;
                            message.channel.send('**['+affType+' - <@'+e.modo+'>]** '+affTime+', <@'+e.membre+'> : '+e.motif);
                        })
                          .catch(function(err) {
                            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                              if(err) throw err;
                            });
                          })
                    }
                }
            )
            connection[0].end()
            connection.shift();
        } 
    }
}