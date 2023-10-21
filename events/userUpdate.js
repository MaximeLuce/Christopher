const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (client, oldUser, newUser) => {
    const embed = new EmbedBuilder()
    .setColor('#3867d6')
    .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
      .setTitle('Utilisateur mis à jour')
      .setTimestamp()

    if (oldUser.username !== newUser.username) {
      embed.addFields({name: 'Utilisateur', value: `${newUser.tag} (ID: ${newUser.id})`})
      embed.addFields({name: 'Changement de pseudo', value: `Ancien pseudo : **${oldUser.username}** \nNouveau pseudo : **${newUser.username}**`})
    }

    if (oldUser.discriminator !== newUser.discriminator) {
      embed.addFields({name: 'Utilisateur', value: `${newUser.tag} (ID: ${newUser.id})`})
      embed.addFields({name: 'Changement de discriminant :', value: `Ancien discriminant : **#${oldUser.discriminator}** \nNouveau discriminant : **#${newUser.discriminator}**`})
    }

    if (oldUser.avatar !== newUser.avatar) {
      embed.addFields({name: 'Utilisateur', value: `${newUser.tag} (ID: ${newUser.id})`})
      embed.addFields({name: 'Changement de photo de profil', value: `[[Ancienne photo]](${oldUser.displayAvatarURL({ dynamic: true })}) → [[Nouvelle photo]](${newUser.displayAvatarURL({ dynamic: true })})`})
    }

    client.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})

}
