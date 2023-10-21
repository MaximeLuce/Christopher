const { EmbedBuilder } = require('discord.js')
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const moment = require("moment");
const aff_horaire = new Date();

module.exports = (client, member) => {
    const connection = []

    const goodbye = new EmbedBuilder()
      .setTitle('**Au revoir !**')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
      .setColor('#3867d6')
      .setTimestamp()
      .setDescription(`**${member.user.username}** est parti(e) du serveur **Le Max De Culture** :wave:.\nBon vent à toi !\nÀ la revoyure !`)
      client.channels.cache.get(constantes["bienvenue"]).send({embeds: [goodbye], files: ['assets/images/logo.png']})

    let today = moment().tz('Europe/Paris').format("YYYY/MM/DD");

    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));

    connection[0].query(`SELECT * FROM commun_stats WHERE date = ?`, 
      [today], 
      async function(err, results) {
        if (err) throw err;
        let membres_perdus = results[0]["membres_perdus"]+1;
        connection.push(createConnection({
          host: config.connexion.host,
          user: config.connexion.user,
          password: config.connexion.password,
          database: config.connexion.database
        }));
        connection[0].query(`UPDATE commun_stats SET membres_perdus = ? WHERE date = ?`, 
          [membres_perdus, today], 
          function(err, results){
              if(err) throw err;
          })
        connection[0].end()
        connection.shift()
    });
    connection[0].end()
    connection.shift()

    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));
    connection[0].query(`DELETE FROM chris_pub WHERE idm = ?`, 
      [member.user.id], 
      function(err, results){
          if(err) throw err;
      })
    connection[0].end()
    connection.shift()

    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));
    connection[0].query(`DELETE FROM chris_anniversaires WHERE id = ?`, 
      [member.user.id], 
      function(err, results){
          if(err) throw err;
      })
    connection[0].end()
    connection.shift()

    const goodbyeLog = new EmbedBuilder()
      .setTitle('**Départ !**')
      .setColor('#3867d6')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields({name: 'Username :', value: member.user.tag, inline: true})
      .setTimestamp()
    client.channels.cache.get(constantes["logs_arr"]).send({embeds: [goodbyeLog]})
}