const { createConnection } = require('mysql2');
const { Permissions } = require("discord.js");
const config = require('../config.json')
const moment = require("date")
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'nouvel-evenement',
	aliases: ['new-event'],
	description: 'Utilisation &nouvel-evenement.',
	execute: async (_client, message, args) => {
		const connection = []
		if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

		const filter = m => m.author.id === message.author.id;

		const questions = ["Ajout d'un événement en cours. Quelle est la date ? (JJ/MM/AAAA-hh:mm)", 
							"Date enregistrée. Quelle est le titre ?", 
							"Titre enregistré. Quels sont les protagonistes ? (ID séparés par un tiret)", 
							"Protagoniste(s) enregistré(s). Quel est le lien de l'affiche ?", 
							"Affiche enregistrée. Quelle est la description ?"];
		const reponses = [];
		let current = 0;

		message.channel.send(questions[current++]);

	    var collector = message.channel.createMessageCollector({filter, time: 300000, max: questions.length})

	    collector.on('collect', m => {
			const currentQuestion = questions[current++];


	        reponses.push(m.content);

	        if (currentQuestion) {
	          message.channel.send(currentQuestion);
	        }
	    })
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });

	    collector.on('end', (collected, reason) => {
	    	message.channel.send("Description enregistrée.");

			// if (reponses[0].match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})-([0-9]{2}):([0-9]{2})$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM/AAAA-hh:mm)')

			var myDate = reponses[0].split('-');
			var date = myDate[0].split('/');
			var heure = myDate[1].split(':');
			const horaire = new Date(date[2], date[1]-1, date[0], heure[0], heure[1]);

			const titre = reponses[1];
			var protagonistes = reponses[2];
			const affiche = reponses[3];
			const description = reponses[4];

			connection.push(createConnection({
				host: config.connexion.host,
				user: config.connexion.user,
				password: config.connexion.password,
				database: config.connexion.database
			}));
			connection[0].query(`INSERT INTO commun_evenements (date, titre, protagonistes, affiche, description) VALUES (?, ?, ?, ?, ?)`, 
				[horaire.getTime()/1000, titre, protagonistes, affiche, description], 
                function(err, results){
                    if(err){
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                })
			connection[0].end()
			connection.shift()

			return message.channel.send(`Événement enregistré !`)
	    })   
	}
}