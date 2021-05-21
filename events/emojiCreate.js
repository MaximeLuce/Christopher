const { MessageEmbed } = require('discord.js')

module.exports = async (_client, guildEmoji) => {
    if(guildEmoji.guild.id !== '506449018885242890') return

    guildEmoji.fetchAuthor().then(author => {
        guildEmoji.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
          .setColor('#3867d6')
          .attachFiles(['assets/images/camera.png'])
          .setAuthor('Logs', 'attachment://camera.png')
          .setTitle('Emoji crée')
          .setThumbnail(guildEmoji.url)
          .addField('Nom :', guildEmoji.name)
          .addField('ID :', guildEmoji.id)
          .addField('Auteur :', author.tag)
          .setTimestamp()
        )
      })
      return
    
}