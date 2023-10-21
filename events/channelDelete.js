const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, channelDelete) => {
    if(channelDelete.guild.id !== '506449018885242890') return

    const channeltype_info = {
        text: 'Salon textuel',
        news: 'Salon news',
        store: 'Salon store',
        voice: 'Salon vocal',
        unknown: 'Inconnu'
      }

    if (channelDelete.type === 'category') {
        const embed = new EmbedBuilder()
          .setColor('#3867d6')
          .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
          .setTitle("Catégorie supprimée")
          .addFields({name: 'Nom :', value: channelDelete.name})
          .setTimestamp()

        return channelDelete.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
      }
  
      const embed2 = new EmbedBuilder()
        .setColor('#3867d6')
        .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTitle('Salon crée')
        .addFields({name: 'Nom :', value: channelDelete.name},
                    {name: 'Type :', value: channeltype_info[channelDelete.type]},
                    {name: 'Catégorie :', value: channelDelete.parent})
        .setTimestamp()

      channelDelete.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed2], files: ['assets/images/camera.png']})
}