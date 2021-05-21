const { createConnection } = require('mysql2');
const config = require('../config.json')

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

exports.run = async (_client, message, args) => {
    if (!config.perms.includes(message.author.id)) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

    if (!args[0]) return message.channel.send('Il faut indiquer une date !')

      if (!args[0].match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})-([0-9]{2}):([0-9]{2})$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ-MM-AAAA-hh:mm)')

      if (!args[2]) return message.channel.send('Veuillez m\'indiquer un évènement à vous rappeler !')

      const date = args[0]

      args.shift()

      if (!args.join(' ') >= 1950) return message.channel.send('Le message est trop long !')

      connection.query(`INSERT INTO reminder_auto (timestamp, userid, topic) VALUES (?, ?, ?)`, [moment(date, 'DD/MM/YYYY-hh:mm').format('x'), message.author.id, args.join(' ')])

      return message.channel.send(`Rappel correctement programmé pour ${date}`)

}

exports.help = {
  name: 'rappelle-moi'
}