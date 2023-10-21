const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'avatar',
  aliases: ['pp', 'pdp'],
  description: 'Utilisation : &avatar [utilisateur] | Sans paramètre affiche votre avatar, avec un membre en paramètre, affiche son avatar.',
  execute: async (_client, message) => {
    const user = message.mentions.users.first() || message.author; // On récupère le membre dont on veut l'avatar
    const avatarEmbed = new EmbedBuilder() // On créé l'embed
        .setColor('#3867d6')
        .setAuthor({name: 'Avatar de : ' + user.username})
        .setImage(user.avatarURL({ format: 'png', dynamic: true, size: 1024 }));
    message.channel.send({embeds: [avatarEmbed]})
      .catch(function(err) {
          fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
          });
      });
  }
}