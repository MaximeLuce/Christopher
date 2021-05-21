const { MessageEmbed } = require('discord.js')

module.exports = async (client, oldUser, newUser) => {
    const embed = new MessageEmbed()
    .setColor('#3867d6')
    .attachFiles(['assets/images/camera.png'])
    .setAuthor('Logs', 'attachment://camera.png')
      .setTitle('Utilisateur mis à jour')
      .setTimestamp()

    if (oldUser.username !== newUser.username) {
      embed.addField('Utilisateur', `${newUser.tag} (ID: ${newUser.id})`)
      embed.addField('Changement de pseudo', `Ancien pseudo : **${oldUser.username}** \nNouveau pseudo : **${newUser.username}**`)
    }

    if (oldUser.discriminator !== newUser.discriminator) {
      embed.addField('Utilisateur', `${newUser.tag} (ID: ${newUser.id})`)
      embed.addField('Changement de discriminant :', `Ancien discriminant : **#${oldUser.discriminator}** \nNouveau discriminant : **#${newUser.discriminator}**`)
    }

    if (oldUser.avatar !== newUser.avatar) {
      embed.addField('Utilisateur', `${newUser.tag} (ID: ${newUser.id})`)
      embed.addField('Changement de photo de profil', `[[Ancienne photo]](${oldUser.displayAvatarURL({ dynamic: true })}) → [[Nouvelle photo]](${newUser.displayAvatarURL({ dynamic: true })})`)
    }

    client.channels.cache.get('835593178064486470').send(embed)

}
