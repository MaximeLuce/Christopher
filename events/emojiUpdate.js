const { MessageEmbed } = require('discord.js')

module.exports = async (_client, oldEmoji, newEmoji) => {
    if(oldEmoji.guild.id !== '506449018885242890') return

    const embed = new MessageEmbed()
      .setColor('#3867d6')
      .setTitle('Emoji mis à jour')
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
      .addField('Nom :', newEmoji.name)
      .setTimestamp()
      .setFooter(this.client.user.username, this.client.user.avatarURL())

    if (oldEmoji.name !== newEmoji.name) {
      embed.addField('Changement de nom :', `Ancien nom : ${oldEmoji.name} \nNouveau nom : ${newEmoji.name}`)
    }

    newGuild.guild.channels.cache.get('835593178064486470').send(embed)
    
}