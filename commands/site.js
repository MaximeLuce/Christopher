const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
  const credits = new MessageEmbed()
    .setTitle(':newspaper: | Site')
    .addField('Lien', 'Pour accéder au menu du Max de Culture, [clique ici !](https://le-max-de-culture.fr/link)')
    .addField('Crédit', 'Merci beaucoup à toute l\'équipe qui participe Ã  ce projet : \nhttps://le-max-de-culture.fr/fr/team/ \net merci à vous qui prenez part au projet car ce n\'est qu\'avec votre aide que ce dernier pourra prospérer de la meilleure des manières ;)')
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .setTimestamp()
  message.channel.send(credits)
}

exports.help = {
  name: 'site'
}
