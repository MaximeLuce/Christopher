const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
    const avatarEmbed = new MessageEmbed()
        .setColor('#3867d6')
        .setTitle('<:lmdc:853372251717107712> Les liens du projet <:lmdc:853372251717107712>')
        .addField('Le Site', `https://le-max-de-culture.fr/`, true)
        .addField('Discord', `https://discord.gg/4VhPeBZ (lien permanent)`, true)
        .addField('Twitter', `https://twitter.com/LeMaxDeCulture`, true)
        .addField('Facebook', `https://www.facebook.com/Le-Max-De-Culture-112009136970590/`, true)
        .addField('Instagram ', `https://www.instagram.com/le.max.de.culture/?hl=fr`, true)
        .addField('La Chaîne Youtube', `https://www.youtube.com/channel/UCcUIG4QC68iMr6iEEXVd8MQ`, true)
        .attachFiles(['assets/images/logo.png'])
        .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    message.channel.send(avatarEmbed);
}

exports.help = {
  name: 'lien'
}
