const { createConnection } = require('mysql2');
const config = require('../config.json')
const { MessageEmbed } = require("discord.js");

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

exports.run = async (_client, message, args) => {
    if (args[0]) {
        if (!args[0].match(/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4})$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM/AAAA)')

        connection.query(
            `SELECT * FROM stats_quizz WHERE date = ?`,
            [args[0]],
            async function(err, results) {
                if (!results[0]) return message.channel.send('Les statistiques des questions de la date indiquée ne sont pas disponibles !')
                
                const total = Number(results[0].vrai) + Number(results[0].faux) + Number(results[0].timeout)
                const statsday = new MessageEmbed()
                    .setTitle(`Statistiques des questions du ${args[0]}`)
                    .addField('Nombre de questions :', total)
                    .addField('Bonnes réponses :', `${results[0].vrai} réponses (${(results[0].vrai/total*100).toFixed(2)}%)`)
                    .addField('Mauvaises réponses :', `${results[0].faux} réponses (${(results[0].faux/total*100).toFixed(2)}%)`)
                    .addField('Temps imparti dépassé :', `${results[0].timeout} réponses (${(results[0].timeout/total*100).toFixed(2)}%)`)
                    .setColor('#3867d6')
                    .attachFiles(['assets/images/logo.png'])
                    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
                    .setTimestamp()
                message.channel.send(statsday)
                
            })

    } else {
        connection.query(
            `SELECT *, SUM(vrai) AS vrai_total, SUM(faux) AS faux_total, SUM(timeout) AS timeout_total FROM stats_quizz`,
            async function(err, results) {
                const total = Number(results[0].vrai_total) + Number(results[0].faux_total) + Number(results[0].timeout_total)
                const stats = new MessageEmbed()
                    .setTitle(`Statistiques globales des questions`)
                    .addField('Nombre de questions :', total)
                    .addField('Bonnes réponses :', `${results[0].vrai_total} réponses (${(results[0].vrai_total/total*100).toFixed(2)}%)`)
                    .addField('Mauvaises réponses :', `${results[0].faux_total} réponses (${(results[0].faux_total/total*100).toFixed(2)}%)`)
                    .addField('Temps imparti dépassé :', `${results[0].timeout_total} réponses (${(results[0].timeout_total/total*100).toFixed(2)}%)`)
                    .setColor('#3867d6')
                    .attachFiles(['assets/images/logo.png'])
                    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
                    .setTimestamp()
                message.channel.send(stats)
                
            })
    }
    

}

exports.help = {
  name: 'question-stats'
}
