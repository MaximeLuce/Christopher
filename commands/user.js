const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
    const user = message.mentions.users.first() || message.author;

    const date = user.createdAt.toString().split(' ')
    const mois = {
      "Jan": "Janvier",
      "Feb": "Février",
      "Mar": "Mars",
      "Apr": "Avril",
      "May": "Mai",
      "Jun": "Juin",
      "Jul": "Juillet",
      "Aug": "Août",
      "Sep": "Septembre",
      "Oct": "Octobre",
      "Nov": "Novembre",
      "Dec": "Décembre"
    }
    const avatarEmbed = new MessageEmbed()
        .setTitle(':bulb: Informations sur ' + user.username + ' :bulb:')
        .addField('Nom', `${user.username}`, true)
        .addField('ID', `${user.id}`, true)
        .addField('Compte créé le ', `${date[2]} ${mois[date[1]]} ${date[3]}, ${date[4]}`, true)
        .addField('Tag : ', `${user.tag}`, true)
        .setColor('#3867d6')
    message.channel.send(avatarEmbed);
}

exports.help = {
  name: 'utilisateur'
}
