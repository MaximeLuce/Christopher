const { createConnection } = require('mysql2');
const { Permissions } = require("discord.js");
const config = require('../config.json')
const constantes = require('../assets/constantes.json');

module.exports = {
	name: 'avent',
	description: 'Utilisation &avent.',
	execute: async (_client, message, args) => {
		const connection = []

		connection.push(createConnection({
			host: config.connexion.host,
			user: config.connexion.user,
			password: config.connexion.password,
			database: config.connexion.database
		}));
		connection[0].query(`SELECT * FROM chris_avent_reponses`,
			function(err, res){
                  if(err) throw err;
                  if(results[0]){
                  	results.forEach(e => {
						var chaine = '';
						chaine += `**Résultats de <@${e.membre}>\n`;

						var nb_essai = JSON.parse((e.nb_essai == "'{}'")?'{}':e.nb_essai);
                    	var time_correct = JSON.parse((e.time_correct == "'{}'")?'{}':e.time_correct);

                    	var jour = new Date();
                    	jour = jour.getDate();

                    	var nb_reussite;
                    	var nb_essais;
                    	var temps_total; 

                    	for (var i = 1; i <= jour; i++) {
                    		if(nb_essai[i] || time_correct[i]){
                    			chaine += `__Énigme n°${i}__\n`;
                    			var essai = (nb_essai[i])?nb_essai[i]:0;
                    			chaine += `Nombre d'essais ratés : ${essai}\n`;
                    			nb_essais += essai;
                    			var delai;
                    			if(time_correct[i]){
                    				nb_reussite+=1;
                    				var time = time_correct[i]
                    				temps_total += time;
                    				const secondes = time%60
                    				time = parseInt(time/60)
                    				const minutes = time%60
                    				time = parseInt(time/60)
                    				const heures = time%24
                    				time = parseInt(time/24)
                    				const jours = time
                    				delai = `${jours} jours, ${heures} heures, ${minutes} minutes, ${secondes} secondes`;
                    			} else{
                    				delai = "Pas encore réussie";
                    			}
                    			chaine += `Délai de réussite : ${delai}\n`
                    		}
                    	}
                    	chaine += `Nombre d'énigmes réussies : ${nb_reussite}\n`
                    	chaine += `Nombre d'essais ratés total : ${nb_essais}\n`

                    	const secondes2 = temps_total%60
        				temps_total = parseInt(temps_total/60)
        				const minutes2 = temps_total%60
        				temps_total = parseInt(temps_total/60)
        				const heures2 = temps_total%24
        				temps_total = parseInt(temps_total/24)
        				const jours2 = temps_total
        				temps_total = `${jours2} jours, ${heures2} heures, ${minutes2} minutes, ${secondes2} secondes`;
                    	chaine += `Temps total : ${temps_total}\n`

						message.channel.send(chaine);
					})
                  }
                })
		connection[0].end()
		connection.shift()

	}
}