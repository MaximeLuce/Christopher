exports.run = (client, message, args) => {
	let chan = message.guild.me.voice.channel;

	if(!chan) return message.channel.send("Je ne suis pas dans un salon vocal.");
	
	chan.leave();
}

exports.help = {
	name: 'quitter'
}
