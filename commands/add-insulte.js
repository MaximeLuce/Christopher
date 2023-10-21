const { Permissions } = require('discord.js');
const { createConnection } = require('mysql2');
const config = require('../config.json')
const constantes = require('../assets/constantes.json')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'ajout-insulte',
	aliases: ['ajoutinsulte','ai', 'ajouter-insulte'],
	description: 'Utilisation &ajout-insulte.',
	execute: async (_client, message, args) => {
		const connection = []
		if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")
		if(!args[0])
			return message.channel.send("Il faut une insulte.")

		connection.push(createConnection({
			host: config.connexion.host,
			user: config.connexion.user,
			password: config.connexion.password,
			database: config.connexion.database
		}))
		connection[0].query(`INSERT INTO commun_insultes (mot) VALUES (?)`, 
			[args[0]], 
            function(err, results){
                if(err){
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                }
            })
		connection[0].end()
		connection.shift()
		
		global.insultes.push(args[0]);

		message.channel.send(`L'insulte ${args[0]} a bien été ajoutée.`)
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });

	}
}