const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, oldMessage, newMessage) => {
    if(oldMessage.channel.type === 'dm') return
    if(newMessage.guild.id !== '506449018885242890') return

    if (oldMessage.partial) await oldMessage.fetch()
    if (newMessage.partial) await newMessage.fetch()

    
    
    const channelSend = newMessage.guild.channels.cache.get(constantes["logs_chris"])

    if(oldMessage.content == null){
      const embed = new EmbedBuilder()
        .setColor('#3867d6')
        .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTitle('Message modifié')
        .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
        .addFields({name: 'Auteur :', value: `${newMessage.author.tag} (ID: ${newMessage.author.id})`},
                  {name: 'Salon :', value: `<#${newMessage.channel.id}>`},
                  {name: 'Ancien message :', value: `Désolé, il m'est impossible d'accéder à ce message.`},
                  {name: 'Nouveau message :', value: `${newMessage.content}`}) 
        .setTimestamp()
    }
    else if (oldMessage.content !== newMessage.content) {
      if (oldMessage.content.length < 1023 || newMessage.content.length < 1023) {
        const embed = new EmbedBuilder()
            .setColor('#3867d6')
            .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
          .setTitle('Message modifié')
          .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
          .addFields({name: 'Auteur :', value: `${newMessage.author.tag} (ID: ${newMessage.author.id})`},
                    {name: 'Salon :', value: `<#${newMessage.channel.id}>`},
                    {name: 'Ancien message :', value: `${oldMessage.content}`},
                    {name: 'Nouveau message :', value: `${newMessage.content}`}) 
          .setTimestamp()

        channelSend.send({embeds: [embed], files: ['assets/images/camera.png']})
      } else {
        const fileContent = `'Ancien message : \n${oldMessage.content} \n\n\nNouveau message : \n${newMessage.content}`

        const embed = new EmbedBuilder()
        .setColor('#3867d6')
        .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTitle('Message modifié')
          .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
          .addFields({name: 'Auteur :', value: `${oldMessage.author.tag} (ID: ${oldMessage.author.id})`},
                    {name: 'Salon :', value: `<#${oldMessage.channel.id}>`})
          .setTimestamp()

        channelSend.send({embeds: [embed], files: ['assets/images/camera.png', { name: 'messageUpdate.txt', attachment: Buffer.from(fileContent, 'utf8') }]})
      }
    } else if (!oldMessage.pinned && newMessage.pinned) {
      const embed = new EmbedBuilder()
      .setColor('#3867d6')
      .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTitle('Message épinglé')
        .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
        .addFields({name: 'Salon :', value: `<#${oldMessage.channel.id}>`})
        .setTimestamp()

      channelSend.send({embeds: [embed], files: ['assets/images/camera.png']})
    } else if (oldMessage.pinned && !newMessage.pinned) {
      const embed = new EmbedBuilder()
      .setColor('#3867d6')
      .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTitle('Message désépinglé')
        .setDescription(`[[Lien du message]](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
        .addFields({name: 'Salon :', value: `<#${oldMessage.channel.id}>`})
        .setTimestamp()

      channelSend.send({embeds: [embed], files: ['assets/images/camera.png']})
    }
    
}