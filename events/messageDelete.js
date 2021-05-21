const { MessageEmbed } = require('discord.js')

module.exports = async (_client, message) => {
    if(message.channel.type === 'dm') return
    if(message.guild.id !== '506449018885242890') return

    if (message.partial) await message.fetch()

    const channelSend = message.guild.channels.cache.get('835593178064486470')

    if (message.content.length < 1023) {
      const embed = new MessageEmbed()
        .setColor('#3867d6')
        .attachFiles(['assets/images/camera.png'])
        .setAuthor('Logs', 'attachment://camera.png')
        .setTitle('Message supprimé :')
        .addField('Auteur :', `${message.author.tag} (ID: ${message.author.id})`)
        .addField('Salon :', `<#${message.channel.id}>`)
        .addField('Message :', `${message.content}`)
        .setTimestamp()

      return channelSend.send(embed)
    } else {
      const embed = new MessageEmbed()
        .setColor('#3867d6')
        .attachFiles(['assets/images/camera.png'])
        .setAuthor('Logs', 'attachment://camera.png')
        .setTitle('Message supprimé :')
        .addField('Auteur :', `${message.author.tag} (ID: ${message.author.id})`)
        .addField('Salon :', `<#${message.channel.id}>`)
        .attachFiles([{ name: 'messageDelete.txt', attachment: Buffer.from(message.content, 'utf8') }])
        .setTimestamp()

      return channelSend.send(embed)
    }
}