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

    const mention = message.mentions.members.first() || message.author

    if (!args[0]) return message.channel.send('Il faut indiquer une date !')

      if (!args[0].match(/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2]))$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM)')

      if (args[0] === '29/02') args[0].replace('29/02', '01/03')

      const date = args[0]

      connection.query(
        'SELECT * FROM birthdays WHERE id = ?',
        [mention.id],
        function(err, results) {
          if (err) console.log(err)
          if(!results[0]) connection.query(`INSERT INTO birthdays (date, id) VALUES (?,?)`, [date, mention.id])
          else connection.query(`UPDATE birthdays SET date = ? WHERE id = ?`, [date, mention.id])
        }
      );

      return message.channel.send(`Anniversaire correctement programmé pour ${mention} au ${date}`)
}

exports.help = {
  name: 'birthday'
}
