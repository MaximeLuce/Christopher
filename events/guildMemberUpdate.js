const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, oldMember, newMember) => {
	if(oldMember.guild.id !== '506449018885242890') return

	const embed = new EmbedBuilder()
		.setColor('#3867d6')
		.setTitle('Membre mis à jour :')
		.addFields({name: 'Membre :', value: `${newMember.user.tag} (ID: ${newMember.user.id})`})
		.setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
		.setTimestamp()

	if (oldMember.nickname !== newMember.nickname) {
		const oldNickname = oldMember.nickname ? oldMember.nickname : 'Pas de surnom'
		const newNickname = newMember.nickname ? newMember.nickname : 'Pas de surnom'

		embed.addFields({name: 'Changement de surnom :', value: `Ancien surnom : **${oldNickname}** \nNouveau surnom : **${newNickname}**`})
	}

	if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
		if (oldMember.roles.cache.size < newMember.roles.cache.size) {
			newMember.roles.cache.map(role => {
				if (!oldMember.roles.cache.has(role.id)) {
					embed.addFields({name: 'Rôle ajouté :', value: `**${oldMember.guild.roles.cache.get(role.id).name}**`})
				}
			})
		} else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
			oldMember.roles.cache.map(role => {
				if (!newMember.roles.cache.has(role.id)) {
					embed.addFields({name: 'Rôle retiré :', value: `**${oldMember.guild.roles.cache.get(role.id).name}**`})
				}
			})
		}
	}
	newMember.guild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
	}