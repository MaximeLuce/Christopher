const { MessageEmbed } = require('discord.js')

module.exports = async (_client, channelDelete) => {
    if(channelDelete.guild.id !== '506449018885242890') return

    const channeltype_info = {
        text: 'Salon textuel',
        news: 'Salon news',
        store: 'Salon store',
        voice: 'Salon vocal',
        unknown: 'Inconnu'
      }

    if (channelDelete.type === 'category') {
        channelDelete.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
          .setColor('#3867d6')
          .attachFiles(['assets/images/camera.png'])
          .setAuthor('Logs', 'attachment://camera.png')
          .setTitle("Catégorie supprimée")
          .addField('Nom :', channelDelete.name)
          .setTimestamp()
        )
        return
      }
  
      channelDelete.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
        .setColor('#3867d6')
        .attachFiles(['assets/images/camera.png'])
        .setAuthor('Logs', 'attachment://camera.png')
        .setTitle('Salon crée')
        .addField('Nom :', channelDelete.name)
        .addField('Type :', channeltype_info[channelDelete.type])
        .addField('Catégorie :', channelDelete.parent)
        .setTimestamp()
      )
}