const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'quit',
	aliases: ['quitter'],
	description: 'Utilisation : &quitter | Permet à Christopher de quitter le salon vocal dans lequel il se trouve.',
	execute: (client, message, args) => {
		let chan = message.guild.members.me.voice.channel;

		if(!chan) return message.channel.send("Je ne suis pas dans un salon vocal.");

		chan.leave();
	}
}