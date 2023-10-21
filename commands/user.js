const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'user',
  aliases: ['membre', 'utilisateur'],
  description: 'Utilisation : &utilisateur [utilisateur] | Permet d\'obtenir les informations sur un utilisateur. Vous si aucun utilisateur spécifié, sinon celui qui est mentionné.',
  execute: async (_client, message) => {
    const user = message.mentions.users.first() || message.author;

    const date = user.createdAt.toString().split(' ')
    const mois = {
      "Jan": "Janvier",
      "Feb": "Février",
      "Mar": "Mars",
      "Apr": "Avril",
      "May": "Mai",
      "Jun": "Juin",
      "Jul": "Juillet",
      "Aug": "Août",
      "Sep": "Septembre",
      "Oct": "Octobre",
      "Nov": "Novembre",
      "Dec": "Décembre"
    }
    const avatarEmbed = new EmbedBuilder()
        .setTitle(':bulb: Informations sur ' + user.username + ' :bulb:')
        .addFields({name: 'Nom',value: `${user.username}`, inline: true},
                  {name: 'ID', value: `${user.id}`, inline: true},
                  {name: 'Compte créé le ', value: `${date[2]} ${mois[date[1]]} ${date[3]}, ${date[4]}`, inline: true},
                  {name: 'Tag : ', value: `${user.tag}`, inline: true})
        .setColor('#3867d6')
    message.channel.send({embeds: [avatarEmbed]})
      .catch(function(err) {
        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
          if(err) throw err;
        });
      });
  }
}