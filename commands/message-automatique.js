const { Permissions } = require('discord.js');
const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'message-automatique',
  aliases: ['msg-auto'],
  description: 'Utilisation &msg-auto date salon message | Envoie le message choisi dans le salon mentionné à la date donnée au format JJ/MM/AAAA-hh:mm.',
  execute: async (_client, message, args) => {
    const connection = []
    if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

    if (!args[0]) return message.channel.send('Il faut indiquer une date !')

    if (!args[0].match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})-([0-9]{2}):([0-9]{2})$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM/AAAA-hh:mm)')

    var myDate = args[0].split('-');
    var date = myDate[0].split('/');
    var heure = myDate[1].split(':');
    const horaire = new Date(date[2], date[1]-1, date[0], heure[0], heure[1]);


    if (!message.mentions.channels.first()) return message.channel.send('Tu dois mentionner un salon !')

    if (!args[2]) return message.channel.send('Veuillez m\'indiquer le message !')

    const channel = message.mentions.channels.first()

    args.shift()
    args.shift()

    if (!args.join(' ') >= 1950) return message.channel.send('Le message est trop long !')

    const mess = args.join(' ');

    // console.log(horaire.getTime()/1000)

    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));
    connection[0].query(`INSERT INTO chris_msg_auto (timestamp, auteur, salon, message) VALUES (?, ?, ?, ?)`, 
        [horaire.getTime()/1000, message.author.id, channel.id, mess], 
        function(err, results){
            if(err){
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            }
        })
    connection[0].end()
    connection.shift()

    return message.channel.send(`Message correctement programmé pour ${myDate} dans ${channel}`)
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
  }
}