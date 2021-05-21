const { MessageEmbed } = require('discord.js')

module.exports = async (client, messageReaction, user) => {
  if (messageReaction.message.guild.id !== '506449018885242890') return

  if (messageReaction.emoji.id === '574587003836825631') {

    client.channels.cache.get('710781127492894741').send('@everyone');
    const report = new MessageEmbed()
      .setTitle(':warning: | Message report')
      .setDescription(`**Message :** \n\n ${messageReaction.message.content}`)
      .addField('Message de :', messageReaction.message.author.tag)
      .addField('Message report par :', user.tag)
      .addField('Nombre de report du message :', messageReaction.count)
      .addField('Lien', `[Clique ici !](${messageReaction.message.url})`)
      .setColor('#3498db')
      .setTimestamp()
    client.channels.cache.get('710781127492894741').send(report)
  }

      const react = new MessageEmbed()
      .setColor('#3867d6')
      .setTitle('Réaction ajoutée :')
      .addField('Message de :', messageReaction.message.author.tag)
      .addField('Réaction de :', user.tag)
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
      .addField('Lien', `[Clique ici !](${messageReaction.message.url})`)
      .setTimestamp()

      return client.channels.cache.get('837417166944731206').send(react)
}