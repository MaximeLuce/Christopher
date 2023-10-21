const { Permissions } = require('discord.js');
const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'ajout-citation',
	aliases: ['add-quote','aq'],
	description: 'Utilisation &ajout-citation.',
	execute: async (_client, message, args) => {
		const connection = []
		if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

		const filter = m => m.author.id === message.author.id;

		const questions = ["Écrivez la citation. (Sans guillemets autour)", 
							"Citation enregistrée. Qui en est l'auteur·e ?"];
		
		const reponses = [];
		let current = 0;

	    const mess = await message.channel.send(questions[current++]);

	    const collector = mess.channel.createMessageCollector({ filter, time: 300000, max: questions.length})

	    collector.on('collect', m => {
			const currentQuestion = questions[current++];

	        reponses.push(m.content);

	        if (currentQuestion) {
	          message.channel.send(currentQuestion)
	            .catch(function(err) {
	                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
	                    if(err) throw err;
	                });
	            });
	        }
	    })

	    collector.on('end', (collected, reason) => {
	    	message.channel.send("Auteur·e enregistré·e.");

			const quote = reponses[0];
			const auth = reponses[1];

			connection.push(createConnection({
				host: config.connexion.host,
				user: config.connexion.user,
				password: config.connexion.password,
				database: config.connexion.database
			}));
			connection[0].query(`INSERT INTO commun_citations (auteur, citation) VALUES (?, ?)`, 
				[auth, quote], 
                function(err, results){
                    if(err){
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                })
			connection[0].end()
			connection.shift()

			return message.channel.send(`Enregistrement terminé !`)
	            .catch(function(err) {
	                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
	                    if(err) throw err;
	                });
	            });
	    })   
	}
}