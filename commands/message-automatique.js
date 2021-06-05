const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

exports.run = async (_client, message, args) => {
    if (!message.member.roles.cache.some(r => r.id == 673268660458094603) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

    if (!args[0]) return message.channel.send('Il faut indiquer une date !')

      if (!args[0].match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})-([0-9]{2}):([0-9]{2})$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM/YYYY-hh:mm)')

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

      connection.query(`INSERT INTO msg_auto (timestamp, channel, message) VALUES (?, ?, ?)`, [horaire.getTime()/1000, channel.id, mess])

      return message.channel.send(`Message correctement programmé pour ${myDate} dans ${channel}`)
}

exports.help = {
  name: 'message-automatique'
}
