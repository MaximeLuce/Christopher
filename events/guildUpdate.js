const { EmbedBuilder } = require('discord.js')
const constantes = require('../assets/constantes.json');
const aff_horaire = new Date();

module.exports = async (_client, oldGuild, newGuild) => {
    if(oldGuild.id !== '506449018885242890') return

    const region = {
        brazil: 'Brésil :flag_br:',
        europe: 'Europe :flag_eu:',
        singapore: 'Singapour :flag_sg:',
        'us-central': 'Centre États-Unis :flag_us:',
        sydney: 'Sydney :flag_au:',
        'us-east': 'Est États-Unis :flag_us:',
        'us-south': 'Sud États-Unis :flag_us:',
        'us-west': 'Ouest États-Unis :flag_us:',
        'vip-us-east': 'VIP Est États-Unis :flag_us:',
        hongkong: 'Hong Kong :flag_hk:',
        russia: 'Russie :flag_ru:',
        southafrica: 'Afrique du Sud :flag_za:',
        japan: 'Japon :flag_jp:'
    }

    const embed = new EmbedBuilder()
    .setColor('#3867d6')
    .setAuthor({name: 'Logs', iconURL: 'attachment://camera.png'})
    .setTitle('Serveur mis à jour :')
    .setTimestamp()

  if (oldGuild.name !== newGuild.name) embed.addFields({name: 'Changement de nom :', value: `Ancien nom : **${oldGuild.name}** \nNouveau nom : **${newGuild.name}**`})

  if (oldGuild.region !== newGuild.region) embed.addFields({name: 'Changement de région :', value: `Ancienne région : **${region[oldGuild.region]}** \nNouvelle région : **${region[newGuild.region]}**`})

  if (oldGuild.icon !== newGuild.icon) {
    const oldIcon = oldGuild.iconURL() ? `[[Ancienne photo]](${oldGuild.iconURL()})` : 'Pas de photo'
    const newIcon = newGuild.iconURL() ? `[[Nouvelle photo]](${newGuild.iconURL()})` : 'Pas de photo'

    embed.addFields({name: 'Changement de la photo du serveur :', value: `${oldIcon} → ${newIcon}`})
  }

  if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
    if (oldGuild.premiumSubscriptionCount < newGuild.premiumSubscriptionCount) embed.addFields({name: 'Ajout d\'un boost :', value: `Niveau actuel : ${newGuild.premiumSubscriptionCount}`})
    if (oldGuild.premiumSubscriptionCount > newGuild.premiumSubscriptionCount) embed.addFields({name: 'Retrait d\'un boost :', value: `Niveau actuel : ${newGuild.premiumSubscriptionCount}`})
  }

  if (oldGuild.premiumTier !== newGuild.premiumTier) {
    if (oldGuild.premiumTier < newGuild.premiumTier) embed.addFields({name: 'Niveau supérieur :', value: `Tier actuel : **${newGuild.premiumTier}**`})
    if (oldGuild.premiumTier > newGuild.premiumTier) embed.addFields({name: 'Niveau inférieur :', value: `Tier actuel : **${newGuild.premiumTier}**`})
  }

  if (oldGuild.afkChannel !== newGuild.afkChannel) {
    const oldAfk = oldGuild.afkChannel ? oldGuild.afkChannel : 'Aucun salon'
    const newAfk = newGuild.afkChannel ? newGuild.afkChannel : 'Aucun salon'

    embed.addFields({name: 'Changement du salon AFK', value: `Ancien salon : **${oldAfk}** \nNouveau salon : **${newAfk}**`})
  }

  if (oldGuild.banner !== newGuild.banner) {
    const oldBanner = oldGuild.bannerURL() ? `[[Ancienne bannière]](${oldGuild.bannerURL()})` : 'Aucune bannière'
    const newBanner = newGuild.bannerURL() ? `[[Nouvelle bannière]](${newGuild.bannerURL()})` : 'Aucune bannière'

    embed.addFields({name: 'Changement de la bannière', value: `${oldBanner} → ${newBanner}`})
  }

  if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
    const oldURL = oldGuild.vanityURLCode ? oldGuild.vanityURLCode : 'Aucune URL'
    const newURL = newGuild.vanityURLCode ? newGuild.vanityURLCode : 'Aucune IRL'

    embed.addFields({name: 'Changement de l\'URL personnalisée :', value: `Ancienne URL **${oldURL}** \nNouvelle URL **${newURL}**`})
  }

  if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) embed.addFields({name: 'Changement du filtre de contenu explicite :', value: `Ancien filtre : **${oldGuild.explicitContentFilter}** \nNouveau filtre : **${newGuild.explicitContentFilter}**`})

  if (oldGuild.verificationLevel !== newGuild.verificationLevel) embed.addFields({name: 'Changement du niveau de vérification :', value: `Ancien niveau : **${oldGuild.verificationLevel}** \nNouveau niveau : **${newGuild.verificationLevel}**`})

  return newGuild.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed], files: ['assets/images/camera.png']})
}