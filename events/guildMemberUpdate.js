const { MessageEmbed } = require('discord.js')

module.exports = async (_client, oldMember, newMember) => {
    if(oldMember.guild.id !== '506449018885242890') return

    const embed = new MessageEmbed()
      .setColor('#3867d6')
      .setTitle('Membre mis à jour :')
      .addField('Membre :', `${newMember.user.tag} (ID: ${newMember.user.id})`)
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
      .setTimestamp()

    if (oldMember.nickname !== newMember.nickname) {
      const oldNickname = oldMember.nickname ? oldMember.nickname : 'Pas de surnom'
      const newNickname = newMember.nickname ? newMember.nickname : 'Pas de surnom'

      embed.addField('Changement de surnom :', `Ancien surnom : **${oldNickname}** \nNouveau surnom : **${newNickname}**`)
    }

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        newMember.roles.cache.map(role => {
          if (!oldMember.roles.cache.has(role.id)) {
            embed.addField('Rôle ajouté :', `**${oldMember.guild.roles.cache.get(role.id).name}**`)
          }
        })
      } else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        oldMember.roles.cache.map(role => {
          if (!newMember.roles.cache.has(role.id)) {
            embed.addField('Rôle retiré :', `**${oldMember.guild.roles.cache.get(role.id).name}**`)
          }
        })
      }
    }
    newMember.guild.channels.cache.get('835593178064486470').send(embed)
}