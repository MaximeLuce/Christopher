const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'pfc',
  aliases: ['pierre-feuille-ciseaux'],
  description: 'Utilisation : &pfc pierre/feuille/ciseaux | Joue à Pierre Feuille Ciseaux contre Christopher.',
  execute: async (_client, message, args) => {
    if (!args[0] || (args[0] !== 'pierre' && args[0] !== 'feuille' && args[0] !== 'ciseaux')) {
      return message.channel.send('Tu dois m\'indiquer ton jeu ! pierre, feuille ou ciseaux')
    }
  
    const embed = new EmbedBuilder()
      .setTitle('Pierre, feuille, ciseaux')
      .setTimestamp()
      .setColor('#3867d6')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})

    const reponse = Math.floor(Math.random() * 3) + 1
  
    if (args[0] === 'pierre') {
      switch (reponse) {
        case 1:
          embed.setDescription('Pierre ! Égalité !')
          break
        case 2:
          embed.setDescription('Papier ! T\'as perdu !')
          break
        case 3:
          embed.setDescription('Ciseaux ! T\'as gagné !')
          break
      }
    } else if (args[0] === 'feuille') {
      switch (reponse) {
        case 1:
          embed.setDescription('Pierre ! T\'as gagné !')
          break
        case 2:
          embed.setDescription('Papier ! Égalité !')
          break
        case 3:
          embed.setDescription('Ciseaux ! T\'as perdu !')
          break
      }
    } else if (args[0] === 'ciseaux') {
      switch (reponse) {
        case 1:
          embed.setDescription('Pierre ! T\'as perdu !')
          break
        case 2:
          embed.setDescription('Papier ! T\'as gagné !')
          break
        case 3:
          embed.setDescription('Ciseaux ! Égalité !')
          break
      }
    }
    
    message.channel.send({embeds: [embed], files: ['assets/images/logo.png']})
      .catch(function(err) {
          fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
          });
      });
  }
}