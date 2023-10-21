const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (client, message) => {
    if(!message.content){
        const channelSend = client.guilds.fetch(constantes["serveur"]).channels.cache.get(constantes["logs_chris"])
        return channelSend.send(`Un message a été supprimé dans <#${message.channelId}>, mais je n'y ai pas accès !`)
    } else {
        const channelSend = message.guild.channels.cache.get(constantes["logs_chris"])

        if (message.content.length < 1023) {
            const embed = new EmbedBuilder()
                .setColor('#3867d6')
                .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
                .setTitle('Message supprimé :')
                .addFields({name: 'Auteur :', value: `${message.author.tag} (ID: ${message.author.id})`},
                          {name: 'Salon :', value: `<#${message.channel.id}>`},
                          {name: 'Message :', value: `${message.content}`})
                .setTimestamp()

          return channelSend.send({embeds: [embed], files: ['assets/images/camera.png']})
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3867d6')
                .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
                .setTitle('Message supprimé :')
                .addFields({name: 'Auteur :', value: `${message.author.tag} (ID: ${message.author.id})`},
                            {name: 'Salon :', value: `<#${message.channel.id}>`})
                .setTimestamp()

          return channelSend.send({embeds: [embed], files: ['assets/images/camera.png', { name: 'messageDelete.txt', attachment: Buffer.from(message.content, 'utf8') }]})
        }
    }
}