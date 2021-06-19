const { MessageEmbed } = require('discord.js')

module.exports = async (_client, oldChannel, newChannel) => {
    if(oldChannel.guild.id !== '506449018885242890') return

      const embed = new MessageEmbed()
      .setColor('#3867d6')
      .attachFiles(['assets/images/camera.png'])
      .setAuthor('Logs', 'attachment://camera.png')
      .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
      .addField(oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', `${newChannel.name} (${newChannel.id})`)
      .setTimestamp()

    if (oldChannel.name !== newChannel.name) {
      embed.addField('Changement de nom :', `Nom avant : **${oldChannel.name}** \nNom après : **${newChannel.name}**`)
    }

    if (oldChannel.parent !== newChannel.parent) {
      embed.addField('Changement de catégorie :', `Catégorie avant : **${oldChannel.parent}** \nCatégorie après **${newChannel.parent}**`)
    }

    if (oldChannel.bitrate !== newChannel.bitrate) {
      embed.addField('Changement de bitrate :', `Bitrate avant : **${oldChannel.bitrate / 1000} kbps** \nBitrate après : **${newChannel.bitrate / 1000} kbps**`)
    }

    if (oldChannel.userLimit !== newChannel.userLimit) {
      embed.addField('Changement de limite de personne :', `Limite avant : **${oldChannel.userLimit === 0 ? 'Aucune limite' : oldChannel.userLimit}** \nLimite après : **${newChannel.userLimit === 0 ? 'Aucune limite' : newChannel.userLimit}**`)
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      embed.addField('Changement du slowmode', `Slowmode avant : **${oldChannel.rateLimitPerUser === 0 ? 'Pas de slowmode' : this.client.functions.getDuration(oldChannel.rateLimitPerUser * 1000)}** \nSlowmode après **${newChannel.rateLimitPerUser === 0 ? 'Aucun slowmode' : this.client.functions.getDuration(newChannel.rateLimitPerUser * 1000)}**`)
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      embed.addField('NSFW :', newChannel.nsfw ? 'Activé' : 'Désactivé')
    }

    if (oldChannel.topic !== newChannel.topic) {
      if (oldChannel.topic.length + newChannel.topic.length < 900) {
        embed.addField('Changement du sujet :', `Ancien sujet \n${oldChannel.topic ? oldChannel.topic : 'Aucun topic'} \n\nNouveau sujet : \n${newChannel.topic ? newChannel.topic : 'Aucun topic'}`)
      } else {
        embed.attachFiles([{ name: 'Topic_channelUpdate.txt', attachment: Buffer.from(`Ancien sujet : \n${oldChannel.topic ? oldChannel.topic : 'Aucun topic'} \n\nNouveau sujet : \n${newChannel.topic ? newChannel.topic : 'Aucun topic'}`, 'utf8') }])
        embed.addField('Changement du sujet :', 'Voir fichier')
      }
    }

    if (embed.fields.length > 1) {
      oldChannel.guild.channels.cache.get('835593178064486470').send(embed)
      return
    }

    if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
      if (oldChannel.permissionOverwrites.size > newChannel.permissionOverwrites.size) {
        oldChannel.permissionOverwrites.map(role => {
          if (!newChannel.permissionOverwrites.has(role.id)) {
            newChannel.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
              .setColor('#3867d6')
              .attachFiles(['assets/images/camera.png'])
              .setAuthor('Logs', 'attachment://camera.png')
              .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
              .addField(oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', `${newChannel.name} (${newChannel.id})`)
              .addField('Changement de permissions :', role.type === 'role' ? `Permission retirée sur le rôle : ${role.name}` : `Permission ajoutée sur le membre : ${newChannel.guild.members.cache.get(role.id).user.username}`)
              .setTimestamp()
            )
          }
        })
        return
      }
      if (oldChannel.permissionOverwrites.size < newChannel.permissionOverwrites.size) {
        newChannel.permissionOverwrites.map(role => {
          if (!oldChannel.permissionOverwrites.has(role.id)) {
            newChannel.guild.channels.cache.get('835593178064486470').send(new MessageEmbed()
              .setColor('#3867d6')
              .attachFiles(['assets/images/camera.png'])
              .setAuthor('Logs', 'attachment://camera.png')
              .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
              .addField(oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', `${newChannel.name} (${newChannel.id})`)
              .addField('Changement de permissions :', role.type === 'role' ? `Permission ajoutée sur le rôle : ${role.name}` : `Permission ajoutée sur le membre : ${oldChannel.guild.members.cache.get(role.id).user.username}`)
              .setTimestamp()
            )
          }
        })
        return
      }

      if (oldChannel.permissionOverwrites.size === newChannel.permissionOverwrites.size) {
        newChannel.permissionOverwrites.map(role => {
          if (role !== oldChannel.permissionOverwrites.get(role.id)) {
            const embed = new MessageEmbed()
              .setColor('#3867d6')
              .attachFiles(['assets/images/camera.png'])
              .setAuthor('Logs', 'attachment://camera.png')
              .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
              .addField(oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', `${newChannel.name} (${newChannel.id})`)
              .setTimestamp()

            const allow = []
            const neutral = []
            const deny = []

            const permOldRoleAllow = Object.entries(oldChannel.permissionOverwrites.get(role.id).allow.serialize())
            const permOldRoleDeny = oldChannel.permissionOverwrites.get(role.id).deny.serialize()

            const permNewRoleAllow = role.allow.serialize()
            const permNewRoleDeny = role.deny.serialize()

            for (const permission of permOldRoleAllow) {
              if (!permission[1] && permNewRoleAllow[permission[0]]) {
                allow.push(permission[0])
              }
              if (!permOldRoleDeny[permission[0]] && permNewRoleDeny[permission[0]]) {
                deny.push(permission[0])
              }
              if ((permission[1] && !permNewRoleAllow[permission[0]] && !permNewRoleDeny[permission[0]]) || (permOldRoleDeny[permission[0]] && !permNewRoleAllow[permission[0]] && !permNewRoleDeny[permission[0]])) {
                neutral.push(permission[0])
              }
            }

            if (allow.length) {
              embed.addField('Permission(s) accordée(s) :', allow.map(flag => `\`${flag}\``).join(' \n'))
            }
            if (neutral.length) {
              embed.addField('Permission(s) neutralisée(s) :', neutral.map(flag => `\`${flag}\``).join(' \n'))
            }
            if (deny.length) {
              embed.addField('Permission(s) refusée(s) :', deny.map(flag => `\`${flag}\``).join(' \n'))
            }

            if (embed.fields.length > 1) {
              oldChannel.guild.channels.cache.get('835593178064486470').send(embed)
            }
          }
        })
      }
    }
}
