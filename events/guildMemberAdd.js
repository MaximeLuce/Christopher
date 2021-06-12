const { MessageEmbed } = require('discord.js')
const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

module.exports = (client, member) => {
  if(member.guild.id !== '506449018885242890') return
    const welcome = new MessageEmbed()
      .setTitle('**Bienvenue !**')
      .attachFiles(['assets/images/logo.png'])
      .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
      .setColor('#3867d6')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setDescription(`Bonjour ${member} :smiley: \nBienvenue sur le serveur __**Le Max De Culture**__ :tada::hugging: !\nJ'espère que tu vas bien !\nN'hésite pas à aller lire le règlement du serveur ici <#748932723669991545> \nEt si tu veux en savoir plus sur le projet **Le Max De Culture**, tu peux aller lire cette page :wink: <#777998621219618846> \nJe me présente rapidement, je suis __**Christopher**__ et je participe activement au développement de ce projet. Pour en savoir plus sur moi, je t'invite à lire ma présentation [ici](https://discord.com/channels/506449018885242890/609369102116716544/736413300040138802) :wink:`)
      client.channels.cache.get('506449018885242894').send(welcome)
  
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

  connection.query(`INSERT INTO pub (idm, time) VALUES (?, ?)`, [member.user.id, time]);
    client.channels.cache.get('589924311557472332').createOverwrite(member, {
      SEND_MESSAGES: false
    })
      .catch(console.error);

  const welcomeLog = new MessageEmbed()
      .setTitle('**Arrivée !**')
      .setColor('#3867d6')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('Username :', member.user.tag, true)
      .addField('Compte crée le :', `${date[2]} ${mois[date[1]]} ${date[3]}, ${date[4]}`, true)
      .setTimestamp()
  client.channels.cache.get('745938396328755220').send(welcomeLog)
}
