const { MessageEmbed } = require('discord.js')

module.exports = async (_client, messages) => {
    const messagesArray = Array.from(messages.values())

    if (messagesArray[1].channel.type === 'dm') return
    if(messagesArray[1].guild.id !== '506449018885242890') return

    const messagesContent = messagesArray.map(message => `**[${message.author.tag} • ${message.author.id}]** \n${message.content}`).join('\n\n')

    if (messagesContent.length < 2000) {
      const embed = new MessageEmbed()
        .setColor('#3867d6')
        .attachFiles(['assets/images/camera.png'])
        .setAuthor('Logs', 'attachment://camera.png')
        .setTimestamp()
        .setTitle('Purge messages')
        .setDescription(`Nombre de messages : ${messagesArray.length} \nSalon : <#${messagesArray[0].channel.id}> \n\n${messagesContent}`)

      return client.channels.cache.get('835593178064486470').send(embed)
    } else {
      const embed = new MessageEmbed()
        .setColor('#3867d6')
        .attachFiles(['assets/images/camera.png'])
        .setAuthor('Logs', 'attachment://camera.png')
        .setTimestamp()
        .setTitle('Purge messages')
        .setDescription(`Nombre de messages : ${messagesArray.length} \nSalon : <#${messagesArray[0].channel.id}>`)
        .attachFiles([{ name: 'messageDeleteBulk.txt', attachment: Buffer.from(messagesContent, 'utf8') }])

      return messagesArray[0].channels.cache.get('835593178064486470').send(embed)
    }
}