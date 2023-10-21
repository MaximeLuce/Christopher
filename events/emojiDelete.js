const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, guildEmoji) => {
    if(guildEmoji.guild.id !== '506449018885242890') return

    const embed = new EmbedBuilder()
      .setColor('#3867d6')
      .setTitle('Emoji supprimé')
      .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
      .setThumbnail(guildEmoji.url)
      .addFields({name: 'Nom :', value: guildEmoji.name},
                {name: 'ID :', value: guildEmoji.id})
      .setTimestamp()

    return guildEmoji.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
}