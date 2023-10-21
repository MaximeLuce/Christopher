const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, channelCreate) => {
    if(channelCreate.guild.id !== '506449018885242890') return

    const channeltype_info = {
        text: 'Salon textuel',
        news: 'Salon news',
        store: 'Salon store',
        voice: 'Salon vocal',
        unknown: 'Inconnu'
      }

    if (channelCreate.type === 'category') {
        const embed = new EmbedBuilder()
          .setColor('#3867d6')
          .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
          .setTitle("Catégorie crée")
          .addFields({name: 'Nom :', value: channelCreate.name})
          .setTimestamp()

        return channelCreate.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
      }

      const embed2 = new EmbedBuilder()
        .setColor('#3867d6')
        .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
        .setTitle('Salon crée')
        .addFields({name: 'Nom :', value: channelCreate.name},
                    {name: 'Type :', value: channeltype_info[channelCreate.type]},
                    {name: 'Catégorie :', value: channelCreate.parent})
        .setTimestamp()
  
      channelCreate.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
}