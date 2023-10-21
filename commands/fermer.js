const { Permissions } = require('discord.js')
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'fermer',
	aliases: ['close'],
	description: 'Permet de fermer un salon aux réponses.',
	execute: async (client, message) => {
		if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")
		message.channel.permissionOverwrites.create(message.channel.guild.roles.everyone, { SEND_MESSAGES: false })
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
		message.channel.permissionOverwrites.create(message.channel.guild.roles.cache.get(constantes['sentinelle']), { SEND_MESSAGES: true })
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
		const msg = "Le salon a bien été fermé.";
		message.channel.send(msg);
	}
}