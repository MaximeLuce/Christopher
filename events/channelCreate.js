const { MessageEmbed } = require('discord.js')

module.exports = async (_client, channelCreate) => {
    if(channelCreate.guild.id !== '506449018885242890') return

    const channeltype_info = {
        text: 'Salon textuel',
        news: 'Salon news',
        store: 'Salon store',
        voice: 'Salon vocal',
        unknown: 'Inconnu'
      }

    if (channelCreate.type === 'category') {
        channelCreate.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
          .setColor('#3867d6')
          .attachFiles(['assets/images/camera.png'])
          .setAuthor('Logs', 'attachment://camera.png')
          .setTitle("Catégorie crée")
          .addField('Nom :', channelCreate.name)
          .setTimestamp()
        )
        return
      }
  
      channelCreate.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
        .setColor('#3867d6')
        .attachFiles(['assets/images/camera.png'])
        .setAuthor('Logs', 'attachment://camera.png')
        .setTitle('Salon crée')
        .addField('Nom :', channelCreate.name)
        .addField('Type :', channeltype_info[channelCreate.type])
        .addField('Catégorie :', channelCreate.parent)
        .setTimestamp()
      )
}