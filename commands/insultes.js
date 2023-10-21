const { EmbedBuilder } = require('discord.js')
const { createConnection } = require('mysql2');
const config = require('../config.json')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'insultes',
  aliases: [],
  description: 'Utilisation : &insultes | Donne la liste des insultes.',
  execute: async (client, message, args) => {
    const connection = []
    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }))
    connection[0].query(`SELECT * FROM commun_insultes`,
    async function(err, results) {
      if(err) {
        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
            if(err) throw err;
        });
      }
      if(results[0]){
        let str = "`"
        let str2 = "`"
        let str3 = "`"
        for (const ab of results) {
          if(str.length < 1950)
            str = str+ab.mot+' ; '
          else if(str2.length < 1950)
            str2 = str2+ab.mot+' ; '
          else
            str3 = str3+ab.mot+' ; '
        }
        str = str.substr(0,(str.length)-3)+'`'
        str2 = str2.substr(0,(str2.length)-3)+'`'
        str3 = str3.substr(0,(str3.length)-3)+'`'
        message.channel.send(str)
        if(str2 != '`')
          message.channel.send(str2)
        if(str3 != '`')
          message.channel.send(str3)
      }
    })

  }
}
