const { MessageEmbed } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json')
const fetch = require('node-fetch')
const moment = require('moment');

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

exports.run = async (_client, message) => {
    try {
      const res = await fetch('https://angeltears.fr/api/grotte/get_question.php?TK=token')
      const body = await res.json()

      if (!body.valid) return message.channel.send('Une erreur est survenue. Merci de réessayer ultérieurement')

      const questionID = body.rep.question[0]

      const date = moment().format("DD/MM/YYYY")

      const embed = new MessageEmbed()
      .setTimestamp()
      .setColor('#3867d6')
      .setTitle(decodeURIComponent(body.rep.question[1]))
      .setDescription(body.rep.reponses.map((answer, i) => `${i + 1} • ${decodeURIComponent(answer)}`).join('\n'))
      .addField('Difficulté :', body.rep.difficulte)
      .setFooter('Vous avez 20 secondes !')

      message.channel.send(embed).then(async msg => {
        await msg.react('1️⃣')
        await msg.react('2️⃣')
        await msg.react('3️⃣')
        await msg.react('4️⃣')
        await msg.react('5️⃣')
        await msg.react('6️⃣')

        const choice = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣']
        const filter = (reaction, user) => choice.includes(reaction.emoji.name) && user.id === message.author.id;

        const collector = msg.createReactionCollector(filter, { time: 20000 });
        collector.on('collect', async r => {
            let index 
            if (r.emoji.name === '1️⃣') index = 0
            if (r.emoji.name === '2️⃣') index = 1
            if (r.emoji.name === '3️⃣') index = 2
            if (r.emoji.name === '4️⃣') index = 3
            if (r.emoji.name === '5️⃣') index = 4
            if (r.emoji.name === '6️⃣') index = 5


            const resAnswer = await fetch(`https://angeltears.fr/api/grotte/verify_question.php?TK=2c07d18b8b2aedbe831927276a87a839cb56aeef68b8cf62d60af3c1fb282595&quest=${questionID}&rep=${index}`)
            const bodyAnswer = await resAnswer.json()

            if (!bodyAnswer.valid) return message.channel.send('Une erreur est survenue. Merci de réessayer ultérieurement')

            if (!bodyAnswer.rep.resultat) {
                message.reply('Ce n\'est pas la bonne réponse !')
                connection.query(
                    `SELECT * FROM stats_quizz WHERE date = ?`,
                    [date],
                    async function(err, results) {
                        if (!results[0]) connection.query(`INSERT INTO stats_quizz (date, vrai, faux, timeout) VALUES (?, 0, 0, 0)`, [date])
                        connection.query(`UPDATE stats_quizz SET faux = faux + 1 WHERE date = ?`, [date])
                    })
            }
            if (bodyAnswer.rep.resultat) {
                message.reply('Bravo ! C\'est la bonne réponse !')
                connection.query(
                    `SELECT * FROM stats_quizz WHERE date = ?`,
                    [date],
                    async function(err, results) {
                        if (!results[0]) connection.query(`INSERT INTO stats_quizz (date, vrai, faux, timeout) VALUES (?, 0, 0, 0)`, [date])
                        connection.query(`UPDATE stats_quizz SET vrai = vrai + 1 WHERE date = ?`, [date])
                    })
            }
            return collector.stop('res')
        })
        collector.on('end', (collected, reason) => {
            if (reason === 'res') { return }
            connection.query(
                `SELECT * FROM stats_quizz WHERE date = ?`,
                [date],
                async function(err, results) {
                    if (!results[0]) connection.query(`INSERT INTO stats_quizz (date, vrai, faux, timeout) VALUES (?, 0, 0, 0)`, [date])
                    connection.query(`UPDATE stats_quizz SET timeout = timeout + 1 WHERE date = ?`, [date])
                })
            return message.reply('Le temps est écoulé !')
        });
      })

    } catch {
        return message.channel.send('Une erreur est survenue. Merci de réessayer ultérieurement')
    }
}
    
exports.help = {
    name: "question"
}
