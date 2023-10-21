const { createConnection } = require('mysql2');
const config = require('../config.json')
const { EmbedBuilder } = require("discord.js");
const aff_horaire = new Date();

module.exports = {
    name: 'question-stats',
    aliases: ['q-stats','questions-stats'],
    description: 'Utilisation : &questions-stats [date] | Sans paramètre donne les statistiques globales du quiz, avec une date au format JJ/MM/AAAA celles du jour en question.',
    execute: async (_client, message, args) => {
        const connection = []

        if (args[0]) {
            if (!args[0].match(/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4})$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM/AAAA)')

            connection.push(createConnection({
              host: config.connexion.host,
              user: config.connexion.user,
              password: config.connexion.password,
              database: config.connexion.database
            }));
            connection[0].query(
                `SELECT * FROM commun_stats_quiz WHERE date = ?`,
                [args[0]],
                async function(err, results) {
                    if(err) throw err;
                    if (!results[0]) return message.channel.send('Les statistiques des questions de la date indiquée ne sont pas disponibles !')
                    
                    const total = Number(results[0].vrai) + Number(results[0].faux) + Number(results[0].hors_delai)
                    const statsday = new EmbedBuilder()
                        .setTitle(`Statistiques des questions du ${args[0]}`)
                        .addFields({name: 'Nombre de questions :', value: total.toString()},
                                {name: 'Bonnes réponses :', value: `${results[0].vrai} réponses (${(results[0].vrai/total*100).toFixed(2)} %)`},
                                {name: 'Mauvaises réponses :', value: `${results[0].faux} réponses (${(results[0].faux/total*100).toFixed(2)} %)`},
                                {name: 'Temps imparti dépassé :', value: `${results[0].hors_delai} réponses (${(results[0].hors_delai/total*100).toFixed(2)} %)`})
                        .setColor('#3867d6')
                        .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
                        .setTimestamp()
                    message.channel.send({embeds: [statsday], files: ['assets/images/logo.png']})
                });
            connection[0].end()
            connection.shift()
        } else {
            connection.push(createConnection({
              host: config.connexion.host,
              user: config.connexion.user,
              password: config.connexion.password,
              database: config.connexion.database
            }));
            connection[0].query(
                `SELECT *, SUM(vrai) AS vrai_total, SUM(faux) AS faux_total, SUM(hors_delai) AS hors_delai_total FROM commun_stats_quiz`,
                async function(err, results) {
                    if(err) throw err;
                    const total = Number(results[0].vrai_total) + Number(results[0].faux_total) + Number(results[0].hors_delai_total)
                    const stats = new EmbedBuilder()
                        .setTitle(`Statistiques globales des questions`)
                        .addFields({name: 'Nombre de questions :', value: total.toString()},
                                {name: 'Bonnes réponses :', value: `${results[0].vrai_total} réponses (${(results[0].vrai_total/total*100).toFixed(2)} %)`},
                                {name: 'Mauvaises réponses :', value: `${results[0].faux_total} réponses (${(results[0].faux_total/total*100).toFixed(2)} %)`},
                                {name: 'Temps imparti dépassé :', value: `${results[0].hors_delai_total} réponses (${(results[0].hors_delai_total/total*100).toFixed(2)} %)`})
                        .setColor('#3867d6')
                        .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
                        .setTimestamp()
                    message.channel.send({embeds: [stats], files: ['assets/images/logo.png']})
                });
            connection[0].end()
            connection.shift()
        }
    }
}