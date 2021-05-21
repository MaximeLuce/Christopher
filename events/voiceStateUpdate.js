const { MessageEmbed } = require('discord.js')

module.exports = async (_client, oldState, newState) => {
    if(role.guild.id !== '506449018885242890') return

    if (!oldState.channel && newState.channel) {

        oldState.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
            .setColor('#3867d6')
            .setTitle('Salon vocal rejoint')
            .attachFiles(['assets/images/camera.png'])
            .setAuthor('Logs', 'attachment://camera.png')
            .addField('Utilisateur :', newState.member.user.tag)
            .addField('Salon :', newState.channel)
            .setTimestamp()
        )
      return

    } else if (oldState.channel && !newState.channel) {

        oldState.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
            .setColor('#3867d6')
            .setTitle('Role crée :')
            .attachFiles(['assets/images/camera.png'])
            .setAuthor('Logs', 'attachment://camera.png')
            .addField('Utilisateur :', oldState.member.user.tag)
            .addField('Salon :', oldState.channel)
            .setTimestamp()
        )
      return

    } else {
        return
    }
    
}