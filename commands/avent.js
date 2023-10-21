const { createConnection } = require('mysql2');
const { Permissions } = require("discord.js");
const config = require('../config.json')
const constantes = require('../assets/constantes.json');

module.exports = {
	name: 'avent',
	description: 'Utilisation &avent.',
	execute: async (_client, message, args) => {
		const connection = []
		if (message.author.id != 323218593275969548) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

		const filter = m => m.author.id === message.author.id;

		const questions = ["Ajout d'une énigme de l'avent en cours. Quelle est le jour ? (JJ)", 
							"Jour enregistré. Quelle est l'énigme ?", 
							"Énigme enregistrée. Quelle est la réponse attendue ?", 
							"Réponse enregistrée. Que dois-je répondre à cela ?"];
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

	    collector.on('end', (collected, reason) => {
	    	message.channel.send("J'ai bien enregistré ma réponse.");

			const jour = reponses[0]
			const question = reponses[1];
			const solution = reponses[2];
			const renvoi = reponses[3];

			connection.push(createConnection({
				host: config.connexion.host,
				user: config.connexion.user,
				password: config.connexion.password,
				database: config.connexion.database
			}));
			connection[0].query(`INSERT INTO chris_avent (jour, question, solution, renvoi) VALUES (?, ?, ?, ?)`, 
				[jour, question, solution, renvoi])
			connection[0].end()
			connection.shift()

			return message.channel.send(`Énigme de l'avent enregistrée !`)
	    })   
	}
}