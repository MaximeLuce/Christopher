const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const date = require("date");
const moment = require("moment");
const aff_horaire = new Date();

module.exports = (client, member) => {
    const connection = []

    const welcome = new EmbedBuilder()
      .setTitle('**Bienvenue !**')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
      .setColor('#3867d6')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setDescription(`Bonjour ${member} :smiley: \nBienvenue sur le serveur __**Le Max De Culture**__ :tada::hugging: !\nJ'espère que tu vas bien !\nN'hésite pas à aller lire le règlement du serveur ici <#748932723669991545> \nEt si tu veux en savoir plus sur le projet **Le Max De Culture**, tu peux aller lire cette page :wink: <#1150131780649750618> \nJe me présente rapidement, je suis __**Christopher**__ et je participe activement au développement de ce projet. Pour en savoir plus sur moi, je t'invite à lire ma présentation [ici](https://discord.com/channels/506449018885242890/609369102116716544/736413300040138802) :wink:`)
      client.channels.cache.get(constantes["bienvenue"]).send({embeds: [welcome], files: ['assets/images/logo.png']})
  
    member.roles.add('640164202987913216')
    member.roles.add('647738569447964682')
    member.roles.add('640164397754613799')
    member.roles.add('640164694287712276')
    member.roles.add('640164816547217420')
    member.roles.add('549964580034707478')

  const date = member.user.createdAt.toString().split(' ')
  const mois = {
    "Jan": "Janvier",
    "Feb": "Février",
    "Mar": "Mars",
    "Apr": "Avril",
    "May": "Mai",
    "Jun": "Juin",
    "Jul": "Juillet",
    "Aug": "Août",
    "Sep": "Septembre",
    "Oct": "Octobre",
    "Nov": "Novembre",
    "Dec": "Décembre"
  }

  let time = new Date().getTime();
  time = Math.round(time/1000);
  time = time + 1296000;
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
      let nouveaux_membres = results[0]["nouveaux_membres"]+1;
      connection.push(createConnection({
        host: config.connexion.host,
        user: config.connexion.user,
        password: config.connexion.password,
        database: config.connexion.database
      }));
      connection[0].query(`UPDATE commun_stats SET nouveaux_membres = ? WHERE date = ?`, 
        [nouveaux_membres, today], 
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
  connection[0].query(`INSERT INTO chris_pub (idm, moment) VALUES (?, ?)`, 
    [member.user.id, time], 
    function(err, results){
        if(err) throw err;
    })
    client.channels.cache.get(constantes["pub"]).permissionOverwrites.create(member, {
      SendMessages: false
    })
  connection[0].end()
  connection.shift()

  const welcomeLog = new EmbedBuilder()
      .setTitle('**Arrivée !**')
      .setColor('#3867d6')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields({name: 'Username :', value: member.user.tag, inline: true},
                {name: 'Compte crée le :', value: `${date[2]} ${mois[date[1]]} ${date[3]}, ${date[4]}`, inline: true})
      .setTimestamp()
  client.channels.cache.get(constantes["logs_arr"]).send({embeds: [welcomeLog]})
}