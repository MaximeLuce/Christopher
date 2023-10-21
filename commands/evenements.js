const { EmbedBuilder, Permissions } = require('discord.js')
const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require('moment');
const date = require('date');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'evenements',
	aliases: ['events', 'evenement'],
	description: 'Utilisation &evenements [nombre].',
	execute: async (_client, message, args) => {

		const connection = []

		const limit = (args[0] ? parseInt(args[0]) : 3);

		const maintenant = new Date().getTime()/1000;

		connection.push(createConnection({
			host: config.connexion.host,
			user: config.connexion.user,
			password: config.connexion.password,
			database: config.connexion.database
		}));
		connection[0].query(`SELECT * FROM commun_evenements WHERE date > ? ORDER BY date ASC limit ?`, 
			[maintenant, limit], 
			function(err, results){
				if(err) {
                	fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    	if(err) throw err;
                	});
            	}
				if(results[0]){
			        results.forEach(e => {
			        	const dat = new Date(e.date*1000)
			        	let jour = ("0" + dat.getDate()).slice(-2);
                        let mois = ("0" + (dat.getMonth() + 1)).slice(-2);
                        let heure = ("0" + dat.getHours()).slice(-2);
                        let minute = ("0" + dat.getMinutes()).slice(-2);
                        let secondes = ("0" + dat.getSeconds()).slice(-2);
                        affTime = 'Le '+jour+'/'+mois+'/'+dat.getFullYear()+' à '+heure+':'+minute;
			        	const prota_tab = e.protagonistes.split('-');
			        	const prota = `<@${prota_tab.map(i => i).join('>, <@')}>`;
						const evenement = new EmbedBuilder()
							.setColor('#3867d6')
							.setTitle(`<:lmdc:750836302823293010> Événement à venir <:lmdc:750836302823293010>`)
							.setThumbnail(e.affiche)
							.addFields({name: 'Date', value: affTime},
									{name: 'Protagonistes', value: prota},
									{name: 'Titre', value: e.titre},
									{name: 'Description', value: e.description})
							.setImage(e.affiche)
							.setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
						message.channel.send({embeds: [evenement], files: ['assets/images/logo.png']})
				            .catch(function(err) {
				                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
				                    if(err) throw err;
				                });
				            });
			        });
			    } else {
			    	message.channel.send('Aucun événement prévu pour le moment.')
			            .catch(function(err) {
			                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
			                    if(err) throw err;
			                });
			            });
			    }
			});
		connection[0].end()
		connection.shift()

	}
}