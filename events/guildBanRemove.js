const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, guild, user) => {
    if(guild.id !== '506449018885242890') return

    const embed = new EmbedBuilder()
      .setColor('#3867d6')
      .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
      .setTitle('Membre débanni :')
      .addFields({name: 'Membre :', value: user.tag})
      .setTimestamp()

    return guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
}