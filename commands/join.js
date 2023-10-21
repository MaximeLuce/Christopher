const { Permissions } = require("discord.js");
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'join',
	aliases: ['rejoindre'],
	description: 'Utilisation : &rejoindre [identifiant] | Permet à Christopher de rejoindre un salon vocal. Celui dans lequel vous êtes si aucun identifiant n\'est précisé, sinon celui qui est précisé.',
	execute: (client, message, args) => {
		let chan;

		if(!args[0]){
			chan = message.member.voice.channel;
		} else {
			chan = client.channels.resolve(args[0]);
		}

		if(!chan || chan.type != 'GUILD_VOICE') return message.channel.send("Vous devez être dans un salon vocal.");
		
		if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) return message.channel.send("Je n'ai pas l'autorisation de me connecter.");

		chan.join().then(connection => console.log('Connecté au salon vocal'))
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
	}
}