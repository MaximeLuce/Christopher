const { MessageEmbed } = require('discord.js')

module.exports = async (_client, oldMessage, newMessage) => {
    if(oldMessage.channel.type === 'dm') return
    if(newMessage.guild.id !== '506449018885242890') return

    if (oldMessage.partial) await oldMessage.fetch()
    if (newMessage.partial) await newMessage.fetch()

    const channelSend = newMessage.guild.channels.cache.get('835593178064486470')

    if (oldMessage.content !== newMessage.content) {
      if (oldMessage.content.length < 1023 || newMessage.content.length < 1023) {
        const embed = new MessageEmbed()
            .setColor('#3867d6')
            .attachFiles(['assets/images/camera.png'])
            .setAuthor('Logs', 'attachment://camera.png')
          .setTitle('Message modifié')
          .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
          .addField('Auteur :', `${oldMessage.author.tag} (ID: ${oldMessage.author.id})`)
          .addField('Salon :', `<#${oldMessage.channel.id}>`)
          .addField('Ancien message :', `${oldMessage.content}`)
          .addField('Nouveau message :', `${newMessage.content}`)
          .setTimestamp()

        channelSend.send(embed)
      } else {
        const fileContent = `'Ancien message : \n${oldMessage.content} \n\n\nNouveau message : \n${newMessage.content}`

        const embed = new MessageEmbed()
        .setColor('#3867d6')
        .attachFiles(['assets/images/camera.png'])
        .setAuthor('Logs', 'attachment://camera.png')
        .setTitle('Message modifié')
          .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
          .addField('Auteur :', `${oldMessage.author.tag} (ID: ${oldMessage.author.id})`)
          .addField('Salon :', `<#${oldMessage.channel.id}>`)
          .attachFiles([{ name: 'messageUpdate.txt', attachment: Buffer.from(fileContent, 'utf8') }])
          .setTimestamp()

        channelSend.send(embed)
      }
    } else if (!oldMessage.pinned && newMessage.pinned) {
      const embed = new MessageEmbed()
      .setColor('#3867d6')
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
        .setTitle('Message épinglé')
        .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
        .addField('Salon :', `<#${oldMessage.channel.id}>`)
        .setTimestamp()

      channelSend.send(embed)
    } else if (oldMessage.pinned && !newMessage.pinned) {
      const embed = new MessageEmbed()
      .setColor('#3867d6')
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
        .setTitle('Message désépinglé')
        .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
        .addField('Salon :', `<#${oldMessage.channel.id}>`)
        .setTimestamp()

      channelSend.send(embed)
    }
}