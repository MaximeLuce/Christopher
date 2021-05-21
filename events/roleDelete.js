const { MessageEmbed } = require('discord.js')

module.exports = async (_client, role) => {
    if(role.guild.id !== '506449018885242890') return

    role.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
      .setColor('#3867d6')
      .setTitle('Role supprimé :')
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
      .addField('Nom :', role)
      .setTimestamp()
    )
      return
    
}