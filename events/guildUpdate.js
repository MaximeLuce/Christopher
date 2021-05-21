const { MessageEmbed } = require('discord.js')

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

    const embed = new MessageEmbed()
    .setColor('#3867d6')
    .attachFiles(['assets/images/camera.png'])
    .setAuthor('Logs', 'attachment://camera.png')
    .setTitle('Serveur mis à jour :')
    .setTimestamp()

  if (oldGuild.name !== newGuild.name) embed.addField('Changement de nom :', `Ancien nom : **${oldGuild.name}** \nNouveau nom : **${newGuild.name}**`)

  if (oldGuild.region !== newGuild.region) embed.addField('Changement de région :', `Ancienne région : **${region[oldGuild.region]}** \nNouvelle région : **${region[newGuild.region]}**`)

  if (oldGuild.icon !== newGuild.icon) {
    const oldIcon = oldGuild.iconURL() ? `[[Ancienne photo]](${oldGuild.iconURL()})` : 'Pas de photo'
    const newIcon = newGuild.iconURL() ? `[[Nouvelle photo]](${newGuild.iconURL()})` : 'Pas de photo'

    embed.addField('Changement de la photo du serveur :', `${oldIcon} → ${newIcon}`)
  }

  if (oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount) {
    if (oldGuild.premiumSubscriptionCount < newGuild.premiumSubscriptionCount) embed.addField('Ajout d\'un boost :', `Niveau actuel : ${newGuild.premiumSubscriptionCount}`)
    if (oldGuild.premiumSubscriptionCount > newGuild.premiumSubscriptionCount) embed.addField('Retrait d\'un boost :', `Niveau actuel : ${newGuild.premiumSubscriptionCount}`)
  }

  if (oldGuild.premiumTier !== newGuild.premiumTier) {
    if (oldGuild.premiumTier < newGuild.premiumTier) embed.addField('Niveau supérieur :', `Tier actuel : **${newGuild.premiumTier}**`)
    if (oldGuild.premiumTier > newGuild.premiumTier) embed.addField('Niveau inférieur :', `Tier actuel : **${newGuild.premiumTier}**`)
  }

  if (oldGuild.afkChannel !== newGuild.afkChannel) {
    const oldAfk = oldGuild.afkChannel ? oldGuild.afkChannel : 'Aucun salon'
    const newAfk = newGuild.afkChannel ? newGuild.afkChannel : 'Aucun salon'

    embed.addField('Changement du salon AFK', `Ancien salon : **${oldAfk}** \nNouveau salon : **${newAfk}**`)
  }

  if (oldGuild.banner !== newGuild.banner) {
    const oldBanner = oldGuild.bannerURL() ? `[[Ancienne bannière]](${oldGuild.bannerURL()})` : 'Aucune bannière'
    const newBanner = newGuild.bannerURL() ? `[[Nouvelle bannière]](${newGuild.bannerURL()})` : 'Aucune bannière'

    embed.addField('Changement de la bannière', `${oldBanner} → ${newBanner}`)
  }

  if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
    const oldURL = oldGuild.vanityURLCode ? oldGuild.vanityURLCode : 'Aucune URL'
    const newURL = newGuild.vanityURLCode ? newGuild.vanityURLCode : 'Aucune IRL'

    embed.addField('Changement de l\'URL personalisée :', `Ancienne URL **${oldURL}** \nNouvelle URL **${newURL}**`)
  }

  if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) embed.addField('Changement du filtre de contenu explicite :', `Ancien filtre : **${oldGuild.explicitContentFilter}** \nNouveau filtre : **${newGuild.explicitContentFilter}**`)

  if (oldGuild.verificationLevel !== newGuild.verificationLevel) embed.addField('Changement du niveau de vérification :', `Ancien niveau : **${oldGuild.verificationLevel}** \nNouveau niveau : **${newGuild.verificationLevel}**`)

  return newGuild.channels.cache.get('835593178064486470').send(embed)
}