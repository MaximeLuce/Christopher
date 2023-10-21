const { ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const moment = require('moment');
const aff_horaire = new Date();

module.exports = {
    name: 'question',
    aliases: ['quiz', 'questions'],
    description: 'Utilisation : &question | Génère une question de culture générale aléatoire. Temps de réponse maximum : 20 secondes.',
    execute: async (_client, message) => {
        try {
            const connection = []

            // return message.reply("Désolé, le quiz n'est pas disponible pour le moment. Désolé du dérangement !")

            const res = await fetch('https://angeltears.fr/api/grotte/get_question.php?TK=2c07d18b8b2aedbe831927276a87a839cb56aeef68b8cf62d60af3c1fb282595')
            const body = await res.json()

            if (!body.valid) return message.channel.send('Une erreur est survenue. Merci de réessayer ultérieurement')

            const questionID = body.rep.question[0]

            const date = moment().format("DD/MM/YYYY")

            if(Math.floor(Math.random()*10000) == 0){
                return message.channel.send("Non désolé, pas maitenant, maitenant j'ai pas envie. Redemande-moi plus tard !");
            }

            const rows = new Array();

            for (var j = 0; j <= 1; j++) {
                var row = new ActionRowBuilder();
                for (var i = 0; i <= 2; i++) {
                        row.addComponents(
                            new ButtonBuilder()
                            .setCustomId(""+(3*j+i))
                            .setLabel(body.rep.reponses[3*j+i])
                            .setStyle(ButtonStyle.Primary),
                    )
                }
                rows.push(row);
            }


            const msg = "**[Difficulté : "+body.rep.difficulte+" / 8]**\n> " + decodeURIComponent(body.rep.question[1])

            message.reply({content: msg, components: rows}).then(async msg => {
                const filter = r => "012345".includes(r.customId)

                const collector = msg.createMessageComponentCollector({ filter, time: 20000 });

                collector.on('collect', async r => {
                    if(message.author.id === r.user.id){
                        let index = parseInt(r.customId)

                        const resAnswer = await fetch(`https://angeltears.fr/api/grotte/verify_question.php?TK=2c07d18b8b2aedbe831927276a87a839cb56aeef68b8cf62d60af3c1fb282595&quest=${questionID}&rep=${index}`)
                        const bodyAnswer = await resAnswer.json()

                        if (!bodyAnswer.valid) return message.channel.send('Une erreur est survenue. Merci de réessayer ultérieurement')

                        if (!bodyAnswer.rep.resultat) {
                            comp = r.message.components
                            comp[Math.floor(index/3)].components[index%3].data.style = ButtonStyle.Danger;
                            await r.update({components : comp});

                            connection.push(createConnection({
                              host: config.connexion.host,
                              user: config.connexion.user,
                              password: config.connexion.password,
                              database: config.connexion.database
                            }));
                            connection[0].query(
                                `SELECT * FROM commun_stats_quiz WHERE date = ?`,
                                [date],
                                async function(err, results) {
                                    if(err) throw err;
                                    connection.push(createConnection({
                                      host: config.connexion.host,
                                      user: config.connexion.user,
                                      password: config.connexion.password,
                                      database: config.connexion.database
                                    }));
                                    if (!results[0]) 
                                        connection[0].query(`INSERT INTO commun_stats_quiz (date, vrai, faux, hors_delai) VALUES (?, 0, 0, 0)`, [date])
                                    connection[0].query(`UPDATE commun_stats_quiz SET faux = faux + 1 WHERE date = ?`, 
                                        [date], 
                                        function(err, results){
                                            if(err) throw err;
                                        })
                                    connection[0].end()
                                    connection.shift()
                                })
                            connection[0].end()
                            connection.shift()

                            connection.push(createConnection({
                              host: config.connexion.host,
                              user: config.connexion.user,
                              password: config.connexion.password,
                              database: config.connexion.database
                            }));
                            connection[0].query(
                                `SELECT * FROM commun_stats_perso_quiz WHERE membre = ?`,
                                [message.author.id],
                                async function(err, results) {
                                    if(err) throw err;
                                    connection.push(createConnection({
                                      host: config.connexion.host,
                                      user: config.connexion.user,
                                      password: config.connexion.password,
                                      database: config.connexion.database
                                    }));
                                    if (!results[0]) 
                                        connection[0].query(`INSERT INTO commun_stats_perso_quiz (membre, vrai, faux, hors_delai) VALUES (?, 0, 0, 0)`, [message.author.id])
                                    connection[0].query(`UPDATE commun_stats_perso_quiz SET faux = faux + 1 WHERE membre = ?`, 
                                        [message.author.id], 
                                        function(err, results){
                                            if(err) throw err;
                                        })
                                    connection[0].end()
                                    connection.shift()
                                })
                            connection[0].end()
                            connection.shift()
                        }
                        if (bodyAnswer.rep.resultat) {
                            comp = r.message.components
                            comp[Math.floor(index/3)].components[index%3].data.style = ButtonStyle.Success;;
                            await r.update({components : comp});

                            connection.push(createConnection({
                              host: config.connexion.host,
                              user: config.connexion.user,
                              password: config.connexion.password,
                              database: config.connexion.database
                            }));
                            connection[0].query(
                                `SELECT * FROM commun_stats_quiz WHERE date = ?`,
                                [date],
                                async function(err, results) {
                                    if(err) throw err;
                                    connection.push(createConnection({
                                      host: config.connexion.host,
                                      user: config.connexion.user,
                                      password: config.connexion.password,
                                      database: config.connexion.database
                                    }));
                                    if (!results[0]) 
                                        connection[0].query(`INSERT INTO commun_stats_quiz (date, vrai, faux, hors_delai) VALUES (?, 0, 0, 0)`, 
                                            [date], 
                                            function(err, results){
                                                if(err) throw err;
                                            })
                                    connection[0].query(`UPDATE commun_stats_quiz SET vrai = vrai + 1 WHERE date = ?`, 
                                        [date], 
                                        function(err, results){
                                            if(err) throw err;
                                        })
                                    connection[0].end()
                                    connection.shift()
                                })
                            connection[0].end()
                            connection.shift()

                            connection.push(createConnection({
                              host: config.connexion.host,
                              user: config.connexion.user,
                              password: config.connexion.password,
                              database: config.connexion.database
                            }));
                            connection[0].query(
                                `SELECT * FROM commun_stats_perso_quiz WHERE membre = ?`,
                                [message.author.id],
                                async function(err, results) {
                                    if(err) throw err;
                                    connection.push(createConnection({
                                      host: config.connexion.host,
                                      user: config.connexion.user,
                                      password: config.connexion.password,
                                      database: config.connexion.database
                                    }));
                                    if (!results[0]) 
                                        connection[0].query(`INSERT INTO commun_stats_perso_quiz (membre, vrai, faux, hors_delai) VALUES (?, 0, 0, 0)`, 
                                            [message.author.id], 
                                            function(err, results){
                                                if(err) throw err;
                                            })
                                    connection[0].query(`UPDATE commun_stats_perso_quiz SET vrai = vrai + 1 WHERE membre = ?`, 
                                        [message.author.id], 
                                        function(err, results){
                                            if(err) throw err;
                                        })
                                    connection[0].end()
                                    connection.shift()
                                })
                            connection[0].end()
                            connection.shift()
                        }
                        return collector.stop('res')
                    }
                    else
                        await r.reply({content: 'Attention, il est impossible de répondre aux questions des autres, utilise &quiz pour tirer une question au hasard !', ephemeral: true});
                    
                })
                collector.on('end', (collected, reason) => {
                    if (reason === 'res') { return }
                    connection.push(createConnection({
                      host: config.connexion.host,
                      user: config.connexion.user,
                      password: config.connexion.password,
                      database: config.connexion.database
                    }));
                    connection[0].query(
                        `SELECT * FROM commun_stats_quiz WHERE date = ?`,
                        [date],
                        async function(err, results) {
                            if(err) throw err;
                            connection.push(createConnection({
                              host: config.connexion.host,
                              user: config.connexion.user,
                              password: config.connexion.password,
                              database: config.connexion.database
                            }));
                            if (!results[0]) 
                                connection[0].query(`INSERT INTO commun_stats_quiz (date, vrai, faux, hors_delai) VALUES (?, 0, 0, 0)`, 
                                    [date], 
                                    function(err, results){
                                        if(err) throw err;
                                    })
                            connection[0].query(`UPDATE commun_stats_quiz SET hors_delai = hors_delai + 1 WHERE date = ?`, 
                                [date], 
                                function(err, results){
                                    if(err) throw err;
                                })
                            connection[0].end()
                            connection.shift()
                        })
                    connection[0].end()
                    connection.shift()

                    connection.push(createConnection({
                      host: config.connexion.host,
                      user: config.connexion.user,
                      password: config.connexion.password,
                      database: config.connexion.database
                    }));
                    connection[0].query(
                        `SELECT * FROM commun_stats_perso_quiz WHERE membre = ?`,
                        [message.author.id],
                        async function(err, results) {
                            if(err) throw err;
                            connection.push(createConnection({
                              host: config.connexion.host,
                              user: config.connexion.user,
                              password: config.connexion.password,
                              database: config.connexion.database
                            }));
                            if (!results[0]) 
                                connection[0].query(`INSERT INTO commun_stats_perso_quiz (membre, vrai, faux, hors_delai) VALUES (?, 0, 0, 0)`, 
                                    [message.author.id], 
                                    function(err, results){
                                        if(err) throw err;
                                    })
                            connection[0].query(`UPDATE commun_stats_perso_quiz SET hors_delai = hors_delai + 1 WHERE membre = ?`, 
                                [message.author.id], 
                                function(err, results){
                                    if(err) throw err;
                                })
                            connection[0].end()
                            connection.shift()
                        })
                    connection[0].end()
                    connection.shift()
                    return message.reply('Le temps est écoulé !')
                });
            })
        } catch {
            return message.channel.send('Une erreur est survenue. Merci de réessayer ultérieurement')
        }
    }
}