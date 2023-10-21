const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = (client, oldState, newState) => {

    if (!oldState.channel && newState.channel) {

        const embed = new EmbedBuilder()
            .setColor('#3867d6')
            .setTitle('Salon vocal rejoint')
            .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
            .addFields({name: 'Utilisateur :', value: newState.member.user.tag})
            .addFields({name: 'Salon :', value: newState.channel.toString()})
            .setTimestamp()

        oldState.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})

        newState.guild.channels.cache.get(constantes["voice_chat"]).permissionOverwrites.create(newState.member.user, {
          ViewChannel : true,
          ReadMessageHistory : true
        })
      return

    } else if (oldState.channel && !newState.channel) {

        const embed = new EmbedBuilder()
            .setColor('#3867d6')
            .setTitle('Salon vocal quitté')
            .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
            .addFields({name: 'Utilisateur :', value: oldState.member.user.tag})
            .addFields({name: 'Salon :', value: oldState.channel.toString()})
            .setTimestamp()

        oldState.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})

        client.channels.cache.get(constantes["voice_chat"]).permissionOverwrites.cache.get(newState.member.user.id).delete()
      return

    } else {
        return
    }

}