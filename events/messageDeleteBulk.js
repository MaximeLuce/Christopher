const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, messages) => {
    const messagesArray = Array.from(messages.values())

    if (messagesArray[1].channel.type === 'dm') return
    if(messagesArray[1].guild.id !== '506449018885242890') return

    const messagesContent = messagesArray.map(message => `**[${message.author.tag} • ${message.author.id}]** \n${message.content}`).join('\n\n')

    if (messagesContent.length < 2000) {
      const embed = new EmbedBuilder()
        .setColor('#3867d6')
        .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTimestamp()
        .setTitle('Purge messages')
        .setDescription(`Nombre de messages : ${messagesArray.length} \nSalon : <#${messagesArray[0].channel.id}> \n\n${messagesContent}`)

      return client.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
    } else {
      const embed = new EmbedBuilder()
        .setColor('#3867d6')
        .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTimestamp()
        .setTitle('Purge messages')
        .setDescription(`Nombre de messages : ${messagesArray.length} \nSalon : <#${messagesArray[0].channel.id}>`)

      return messagesArray[0].channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png', { name: 'messageDeleteBulk.txt', attachment: Buffer.from(messagesContent, 'utf8') }]})
  }
}