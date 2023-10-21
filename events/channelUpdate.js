const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, oldChannel, newChannel) => {
    // if(oldChannel.guild.id !== '506449018885242890') return

      const embed = new EmbedBuilder()
      .setColor('#3867d6')
      .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
      .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
      .addFields({name: oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', value: `${newChannel.name} (${newChannel.id})`})
      .setTimestamp()

    if (oldChannel.name !== newChannel.name) {
      embed.addFields({name: 'Changement de nom :', value: `Nom avant : **${oldChannel.name}** \nNom après : **${newChannel.name}**`})
    }

    if (oldChannel.parent !== newChannel.parent) {
      embed.addFields({name: 'Changement de catégorie :', value: `Catégorie avant : **${oldChannel.parent}** \nCatégorie après **${newChannel.parent}**`})
    }

    if (oldChannel.bitrate !== newChannel.bitrate) {
      embed.addFields({name: 'Changement de bitrate :', value: `Bitrate avant : **${oldChannel.bitrate / 1000} kbps** \nBitrate après : **${newChannel.bitrate / 1000} kbps**`})
    }

    if (oldChannel.userLimit !== newChannel.userLimit) {
      embed.addFields({name: 'Changement de limite de personne :', value: `Limite avant : **${oldChannel.userLimit === 0 ? 'Aucune limite' : oldChannel.userLimit}** \nLimite après : **${newChannel.userLimit === 0 ? 'Aucune limite' : newChannel.userLimit}**`})
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      embed.addFields({name: 'Changement du slowmode', value: `Slowmode avant : **${oldChannel.rateLimitPerUser === 0 ? 'Pas de slowmode' : this.client.functions.getDuration(oldChannel.rateLimitPerUser * 1000)}** \nSlowmode après **${newChannel.rateLimitPerUser === 0 ? 'Aucun slowmode' : this.client.functions.getDuration(newChannel.rateLimitPerUser * 1000)}**`})
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      embed.addFields({name: 'NSFW :', value: newChannel.nsfw ? 'Activé' : 'Désactivé'})
    }

    if (oldChannel.topic !== newChannel.topic) {
      if (oldChannel.topic.length + newChannel.topic.length < 900) {
        embed.addFields({name: 'Changement du sujet :', value: `Ancien sujet \n${oldChannel.topic ? oldChannel.topic : 'Aucun topic'} \n\nNouveau sujet : \n${newChannel.topic ? newChannel.topic : 'Aucun topic'}`})
      } else {
        embed.attachFiles([{ name: 'Topic_channelUpdate.txt', attachment: Buffer.from(`Ancien sujet : \n${oldChannel.topic ? oldChannel.topic : 'Aucun topic'} \n\nNouveau sujet : \n${newChannel.topic ? newChannel.topic : 'Aucun topic'}`, 'utf8') }])
        embed.addFields({name: 'Changement du sujet :', value: 'Voir fichier'})
      }
    }

    if (embed.fields.length > 1) {
      return oldChannel.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
    }

    if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
      if (oldChannel.permissionOverwrites.size > newChannel.permissionOverwrites.size) {
        oldChannel.permissionOverwrites.cache.map(role => {
          if (!newChannel.permissionOverwrites.cache.has(role.id)) {
            const embed = new EmbedBuilder()
              .setColor('#3867d6')
              .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
              .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
              .addFields({name: oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', value: `${newChannel.name} (${newChannel.id})`})
              .addFields({name: 'Changement de permissions :', value: role.type === 'role' ? `Permission retirée sur le rôle : ${role.name}` : `Permission retirée sur le membre : ${newChannel.guild.members.cache.get(role.id).user.username}`})
              .setTimestamp()

            newChannel.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
          }
        })
        return
      }
      if (oldChannel.permissionOverwrites.size < newChannel.permissionOverwrites.size) {
        newChannel.permissionOverwrites.cache.map(role => {
          if (!oldChannel.permissionOverwrites.cache.has(role.id)) {
            const embed = new EmbedBuilder()
              .setColor('#3867d6')
              .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
              .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
              .addFields({name: oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', value: `${newChannel.name} (${newChannel.id})`})
              .addFields({name: 'Changement de permissions :', value: role.type === 'role' ? `Permission ajoutée sur le rôle : ${role.name}` : `Permission ajoutée sur le membre : ${oldChannel.guild.members.cache.get(role.id).user.username}`})
              .setTimestamp()

            newChannel.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
          }
        })
        return
      }

      if (oldChannel.permissionOverwrites.size === newChannel.permissionOverwrites.size) {
        newChannel.permissionOverwrites.cache.map(role => {
          if (role !== oldChannel.permissionOverwrites.cache.get(role.id)) {
            const embed = new EmbedBuilder()
              .setColor('#3867d6')
              .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
              .setTitle(oldChannel.type === 'category' ? 'Catégorie modifiée' : 'Salon modifié')
              .addFields({name: oldChannel.type === 'category' ? 'Catégorie' : 'Salon :', value: `${newChannel.name} (${newChannel.id})`})
              .setTimestamp()

            const allow = []
            const neutral = []
            const deny = []


            if(oldChannel.permissionOverwrites.cache.get(role.id)){
              var permOldRoleAllow = Object.entries(oldChannel.permissionOverwrites.cache.get(role.id).allow.serialize())
              var permOldRoleDeny = oldChannel.permissionOverwrites.cache.get(role.id).deny.serialize()
            } else{ 
              var permOldRoleAllow = []
              var permOldRoleDeny = []
            }

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
              embed.addFields({name: 'Permission(s) accordée(s) :', value: allow.map(flag => `\`${flag}\``).join(' \n')})
            }
            if (neutral.length) {
              embed.addFields({name: 'Permission(s) neutralisée(s) :', value: neutral.map(flag => `\`${flag}\``).join(' \n')})
            }
            if (deny.length) {
              embed.addFields({name: 'Permission(s) refusée(s) :', value: deny.map(flag => `\`${flag}\``).join(' \n')})
            }

            if (embed.fields.length > 1) {
              oldChannel.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
            }
          }
        })
      }
    }
}