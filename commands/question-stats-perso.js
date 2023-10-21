const { createConnection } = require('mysql2');
const config = require('../config.json')
const { EmbedBuilder } = require("discord.js");
const aff_horaire = new Date();

module.exports = {
    name: 'question-stats-perso',
    aliases: ['q-stats-perso','questions-stats-perso', 'qsp'],
    description: 'Utilisation : &questions-stats-perso [id] | Donne les statistiques de la personne dont l\'identifiant est passé en paramètre (ou du sien).',
    execute: async (_client, message, args) => {

        if (!message.member.id == 241945809460002817) return 

        const connection = []

        let membre;

        if (args[0])
            membre = args[0]
        else
            membre = message.author.id

        connection.push(createConnection({
          host: config.connexion.host,
          user: config.connexion.user,
          password: config.connexion.password,
          database: config.connexion.database
        }));
        connection[0].query(
            `SELECT * FROM commun_stats_perso_quiz WHERE membre = ?`,
            [membre],
            async function(err, results) {
                if(err) throw err;
                if (!results[0]) return message.channel.send('Les statistiques des questions du membre ne sont pas disponibles !')
                
                const total = Number(results[0].vrai) + Number(results[0].faux) + Number(results[0].hors_delai)
                const statsday = new EmbedBuilder()
                    .setTitle(`Statistiques des questions de <@${membre}>`)
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
        
    }
}