exports.run = (client, message, args) => {
	let chan;

	if(!args[0]){
		chan = message.member.voice.channel;
	}

	if(!chan || chan.type != 'voice') return message.channel.send("Vous devez être dans un salon vocal.");
	
	if(!message.guild.me.hasPermission("CONNECT")) return message.channel.send("Je n'ai pas l'autorisation de me connecter.");

	chan.join().then(connection => console.log('Connecté au salon vocal')).catch(console.error);
}

exports.help = {
	name: 'join'
}
