const { MessageEmbed } = require('discord.js')

module.exports = (client, oldState, newState) => {

    if (!oldState.channel && newState.channel) {

        oldState.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
            .setColor('#3867d6')
            .setTitle('Salon vocal rejoint')
            .attachFiles(['assets/images/camera.png'])
            .setAuthor('Logs', 'attachment://camera.png')
            .addField('Utilisateur :', newState.member.user.tag)
            .addField('Salon :', newState.channel)
            .setTimestamp()
        );

        newState.guild.channels.cache.get('609794221616136192').createOverwrite(newState.member.user, {
          VIEW_CHANNEL : true,
          READ_MESSAGE_HISTORY : true
        })
      return

    } else if (oldState.channel && !newState.channel) {

        oldState.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
            .setColor('#3867d6')
            .setTitle('Salon vocal quitté')
            .attachFiles(['assets/images/camera.png'])
            .setAuthor('Logs', 'attachment://camera.png')
            .addField('Utilisateur :', oldState.member.user.tag)
            .addField('Salon :', oldState.channel)
            .setTimestamp()
        )
        client.channels.cache.get('609794221616136192').permissionOverwrites.get(newState.member.user.id).delete();
      return

    } else {
        return
    }

}
