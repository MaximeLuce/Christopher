const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
    const avatarEmbed = new MessageEmbed()
        .setColor('#3867d6')
        .setTitle(':bulb: Informations sur le serveur :bulb:')
        .addField('Nom du serveur', `${message.guild.name}`, true)
        .addField('Nombre de membres', `${message.guild.memberCount}`, true)
        .addField('Serveur créé le ', `${message.guild.createdAt}`, true)
        .addField('Région ', `${message.guild.region}`, true)
        .addField('Fondateur ', `${message.guild.owner}`, true)
        .addField('Salon Vocal Afk ', `${message.guild.afkChannel}`, true)
        .attachFiles(['assets/images/logo.png'])
        .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    message.channel.send(avatarEmbed);
}

exports.help = {
  name: 'serveur'
}
