const { Permissions } = require("discord.js");
const config = require('../config.json')
const constantes = require('../assets/constantes.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
	name: 'question-add',
    aliases: ['add-question', 'a-q', 'ajout-question'],
    description: 'Utilisation : &question-add. Demande la question, puis chacune des propositions, en commençant par la bonne réponse.',
	execute: async (_client, message, args) => {
		const connection = []

		const filter = m => m.author.id === message.author.id;

		const questions = ["Ajout d'une question au quiz en cours. Quelle est la question ?", 
							"Question enregistrée. Quelle est la bonne réponse ?", 
							"Bonne réponse enregistrée. Quelles sont les mauvaises réponses (donnez-les une par une) ?", 
							"Première mauvaise réponse enregistrée. Donnez la deuxième.", 
							"Deuxième mauvaise réponse enregistrée. Donnez la troisième.", 
							"Troisième mauvaise réponse enregistrée. Donnez la quatrième.", 
							"Quatrième mauvaise réponse enregistrée. Donnez la cinquième."];
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
	    	message.channel.send("Dernière mauvaise réponse enregistrée.");

			// if (reponses[0].match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})-([0-9]{2}):([0-9]{2})$/gm)) return message.channel.send('La date n\'est pas dans le bon format (JJ/MM/AAAA-hh:mm)')

			const question = reponses[0];
			const liste_rep = reponses.slice(1)

			const envoi = new Object;

			const proposition = new Object;

			proposition['question'] = question
			proposition['reponses'] = liste_rep
			
			envoi['TK'] = '2c07d18b8b2aedbe831927276a87a839cb56aeef68b8cf62d60af3c1fb282595'
			envoi['proposition'] = proposition

			fetch('https://angeltears.fr/api/grotte/send_question.php', {
			    method: 'POST',
			    headers: {
			        'Accept': 'application/json',
			        'Content-Type': 'application/json'
			    },
			    body: JSON.stringify(envoi)
			})
			   .then(response => response.json())
			   .then(response => console.log(JSON.stringify(response)))

			return message.channel.send(`Événement enregistré !`)
	    })   
	}
}