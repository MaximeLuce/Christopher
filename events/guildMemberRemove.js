const { MessageEmbed } = require('discord.js')

module.exports = (client, member) => {
    if(member.guild.id !== '506449018885242890') return
    const goodbye = new MessageEmbed()
      .setTitle('**Au revoir !**')
      .attachFiles(['assets/images/logo.png'])
      .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
      .setColor('#3867d6')
      .setTimestamp()
      .setDescription(`**${member.user.username}** est parti(e) du serveur **Le Max De Culture** :wave:.\nBon vent à toi !\nÀ la revoyure !`)
      client.channels.cache.get('506449018885242894').send(goodbye)

  const goodbyeLog = new MessageEmbed()
      .setTitle('**Départ !**')
      .setColor('#3867d6')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('Username :', member.user.tag, true)
      .setTimestamp()
  client.channels.cache.get('745938396328755220').send(goodbyeLog)
}