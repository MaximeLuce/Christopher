const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
  const help = new MessageEmbed()
    .setTitle('Voici mes commandes pour vous aider :')
    .addField(':gear: | Utilitaires', '```aide \ncitation \nitunes \nmdn \nmeteo \nping \nstrawpoll \nwikipedia```', true)
    .addField(':game_die: | Détente', '```dé \ndemineur \npfc \nquestion```', true)
    .addField(':newspaper: | Info', '```avatar \nlien \nserveur \nsite \nutilisateur \nquestion-stats```', true)
    .addField('<:modo:574587003836825631> | Modération', '```mute \nunmute \nkick \nban \nfetch-ban \nanniversaire \nmessage-automatique \nsuivi \nsuivi-recap```', true)
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .setTimestamp()
  message.channel.send(help)
}

exports.help = {
  name: 'aide'
}
