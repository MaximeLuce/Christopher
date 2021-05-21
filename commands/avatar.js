const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
    const user = message.mentions.users.first() || message.author;
    const avatarEmbed = new MessageEmbed()
        .setColor('#3867d6')
        .setAuthor('Avatar de : ' + user.username)
        .setImage(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }));
    message.channel.send(avatarEmbed);
}

exports.help = {
  name: 'avatar'
}
