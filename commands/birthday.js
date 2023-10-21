const { Permissions } = require('discord.js');
const { createConnection } = require('mysql2');
const config = require('../config.json')
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'anniversaire',
  aliases: ['birthday', 'bd', 'anniv'],
  description: 'Utilisation &anniversaire [utilisateur] date | Permet d\'enregistrer l\'anniversaire de l\'utilisateur mentionné (ou du votre si aucun utilisateur mentionné)',
  execute: async (_client, message, args) => {
    const connection = []

    let mention;
    let date;

    if (!args[0]) return message.channel.send('Il faut indiquer une date !')

    if (!message.member.roles.cache.has(constantes["habitue"]) || message.mentions.members.size == 0){
        mention = message.author
        date = args[0]
    } else {
        mention = message.mentions.members.first()
        date = args[1]
    }

    if (!date.match(/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2]))$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM)')

    if (date === '29/02') date.replace('29/02', '01/03')

    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));
    connection[0].query(
      'SELECT * FROM chris_anniversaires WHERE id = ?',
      [mention.id],
      function(err, results) {
        if (err) {
          fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
          });
        }
        connection.push(createConnection({
          host: config.connexion.host,
          user: config.connexion.user,
          password: config.connexion.password,
          database: config.connexion.database
        }));
        if(!results[0]) connection[0].query(`INSERT INTO chris_anniversaires (date, id) VALUES (?,?)`, 
            [date, mention.id], 
            function(err, results){
                if(err){
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                }
            })
        else connection[0].query(`UPDATE chris_anniversaires SET date = ? WHERE id = ?`, 
            [date, mention.id], 
            function(err, results){
                if(err){
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                }
            })
        connection[0].end()
        connection.shift()
      }
    );
    connection[0].end()
    connection.shift()

    return message.channel.send(`Anniversaire correctement programmé pour ${mention} au ${date}`)
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
  }
}