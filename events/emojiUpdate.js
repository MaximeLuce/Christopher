const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, oldEmoji, newEmoji) => {
    if(oldEmoji.guild.id !== '506449018885242890') return

    const embed = new EmbedBuilder()
      .setColor('#3867d6')
      .setTitle('Emoji mis à jour')
      .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
      .addFields({name: 'Nom :', value: newEmoji.name})
      .setTimestamp()
      .setFooter(this.client.user.username, this.client.user.avatarURL())

    if (oldEmoji.name !== newEmoji.name) {
      embed.addFields({name: 'Changement de nom :', value: `Ancien nom : ${oldEmoji.name} \nNouveau nom : ${newEmoji.name}`})
    }

    newGuild.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
    
}