const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message, args) => {
    if (!args[0] || (args[0] !== 'pierre' && args[0] !== 'feuille' && args[0] === 'ciseaux')) {
        message.channel.send('Tu dois m\'indiquer ton jeu ! pierre, feuille ou ciseaux')
        return
      }
  
      const embed = new MessageEmbed()
        .setTitle('Pierre, feuille, ciseaux')
        .setTimestamp()
        .setColor('#3867d6')
        .attachFiles(['assets/images/logo.png'])
        .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
  
      const reponse = Math.floor(Math.random() * (3 - 1 + 1)) + 1
  
      if (args[0] === 'pierre') {
        switch (reponse) {
          case 1:
            embed.setDescription('Pierre ! Égalité !')
            break
          case 2:
            embed.setDescription('Papier ! Perdu !')
            break
          case 3:
            embed.setDescription('Ciseaux ! Gagné !')
            break
        }
      } else if (args[0] === 'feuille') {
        switch (reponse) {
          case 1:
            embed.setDescription('Pierre ! Gagné !')
            break
          case 2:
            embed.setDescription('Papier ! Égalité !')
            break
          case 3:
            embed.setDescription('Ciseaux ! Perdu !')
            break
        }
      } else if (args[0] === 'ciseaux') {
        switch (reponse) {
          case 1:
            embed.setDescription('Pierre ! Perdu !')
            break
          case 2:
            embed.setDescription('Papier ! Gagné !')
            break
          case 3:
            embed.setDescription('Ciseaux ! Égalité !')
            break
        }
  
        
}
   message.channel.send(embed)
}

exports.help = {
  name: 'pfc'
}