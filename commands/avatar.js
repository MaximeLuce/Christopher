const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
    const user = message.mentions.users.first() || message.author; // On récupère le membre dont on veut l'avatar
    const avatarEmbed = new MessageEmbed() // On créé l'embed
        .setColor('#3867d6')
        .setAuthor('Avatar de : ' + user.username)
        .setImage(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }));
    message.channel.send(avatarEmbed); // On l'envoie
}

exports.help = {
  name: 'avatar'
}
