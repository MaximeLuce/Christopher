const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
  const help = new MessageEmbed()
    .setTitle(':bulb: Commande d\'aide :bulb:')
    .setDescription('Voici mes commandes pour vous aider :')
    .addField(':gear: | Utilitaires', '```aide \ncitation \ndé \nitunes \nmdn \nmeteo \npfc \nstrawpoll \nwikipedia```', true)
    .addField(':question: | Autres', '```site \nquestion \nquestion-stats```', true)
    .addField(':computer: | Commandes automatiques', '```La citation du jour```', true)
    .addField(':tools: | Info', '```ping \navatar \nserveur \nutilisateur```', true)
    .addField(':hammer: | Modération', '```ban \nbirthday \nfetch-ban \nexpulser```', true)
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .setTimestamp()
  message.channel.send(help)
}

exports.help = {
  name: 'aide'
}
