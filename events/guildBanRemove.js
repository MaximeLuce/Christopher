const { MessageEmbed } = require('discord.js')

module.exports = async (_client, guild, user) => {
    if(guild.id !== '506449018885242890') return

    guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
      .setColor('#3867d6')
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
      .setTitle('Membre débanni :')
      .addField('Membre :', user.tag)
      .setTimestamp()
    )
      return
    
}