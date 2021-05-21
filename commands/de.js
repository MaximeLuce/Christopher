const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
    return message.channel.send(new MessageEmbed()
    .setTimestamp()
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .addField(':game_die: | Et le numéro sera...', Math.floor(Math.random() * (6 - 1 + 1)) + 1)
  )
}

exports.help = {
  name: 'dé'
}