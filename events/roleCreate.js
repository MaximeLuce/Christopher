const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, role) => {
    if(role.guild.id !== '506449018885242890') return

    const embed = new EmbedBuilder()
      .setColor('#3867d6')
      .setTitle('Role crée :')
      .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
      .addFields({name: 'Nom :', value: role})
      .setTimestamp()

    role.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
      return
    
}