const hello1 = require('../assets/hello1.json')
const hello2 = require('../assets/hello2.json')
const hello3 = require('../assets/hello3.json')
const grossier = require('../assets/grossier.json')
const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

module.exports = (client, message) => {
  const prefix = '&'
  let time = new Date().getTime();
  time = Math.round(time/1000);
  time = time + 1296000;

  if (message.author.bot) return
  if (message.channel.type === 'dm') return
  if (message.attachments.size !== 0) return

  if(message.channel.id == 589924311557472332){
    connection.query(`INSERT INTO pub (idm, time) VALUES (?, ?)`, [message.author.id, time]);
    message.channel.createOverwrite(message.author, {
      SEND_MESSAGES: false
    })
      .catch(console.error);
  }

  const words = ['bonjour', 'salut', 'coucou', 'hey', 'hi', 'hello', 'yo', 'bonsoir']
  if (words.includes(message.content.toLowerCase().replace(/([!,.?:])+/, ''))) {
    const helloMessage1 = hello1[Math.floor(Math.random() * hello1.length)]
    message.channel.send(helloMessage1)
    const collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { time: 15000, max: 1 })

    collector.on('collect', m => {
      const answers = ['toi', 'vous']
      for (const answer of answers) {
        const words = m.content.toLowerCase().trim().split(' ')
        const test = words.some(word => {
          return answer.toLowerCase().includes(word)
        })

        if (test && words.includes(answer.toLowerCase())) {
          const helloMessage2 = hello2[Math.floor(Math.random() * hello2.length)]
          return message.channel.send(helloMessage2)
        }
      }

      const answers2 = ['robot', 'vilain', 'tas', 'ferraille', 'pue', 'espece', 'espèce', 'chut']
      for (const answer of answers2) {
        const words = m.content.toLowerCase().trim().split(' ')
        const test = words.some(word => {
          return answer.toLowerCase().includes(word)
        })

        if (test && words.includes(answer.toLowerCase())) {
          const helloMessage3 = hello3[Math.floor(Math.random() * hello3.length)]
          return message.channel.send(helloMessage3)
        }
      }
    })
  }

  const badWords = ['tg', 'pute', 'merde', 'fdp', 'ptn', 'fuck', 'connard', 'salope', 'con', 'salaud', 'gueule']
  for (const badword of badWords) {
    const words = message.content.toLowerCase().trim().split(' ')
    const test = words.some(word => {
      return badword.toLowerCase().includes(word)
    })
    if (test && words.includes(badword.toLowerCase())) {
      const grossierMessage = grossier[Math.floor(Math.random() * grossier.length)]
      return message.channel.send(grossierMessage)
    }
  }

  const messageArray = message.content.split(' ')
  const cmd = messageArray[0]
  const args = messageArray.slice(1)

  const commandfile = client.commands.get(cmd.split(prefix)[1])

  if (!cmd.startsWith(prefix)) return

  if (commandfile) commandfile.run(client, message, args)
}
