const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'site',
  aliases: [],
  description: 'Utilisation : Maxime va s\'en charger ;P',
  execute: async (_client, message) => {
    const credits = new EmbedBuilder()
      .setTitle(':newspaper: | Site')
      .addFields({name: 'Lien', value: 'Pour accéder au menu du Max de Culture, [clique ici !](https://le-max-de-culture.fr/link)'},
                {name: 'Crédit', value: 'Merci beaucoup à toute l\'équipe qui participe à ce projet : \nhttps://le-max-de-culture.fr/fr/team/ \net merci à vous qui prenez part au projet car ce n\'est qu\'avec votre aide que ce dernier pourra prospérer de la meilleure des manières ;)'})
      .setColor('#3867d6')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
      .setTimestamp()
    message.channel.send({embeds: [credits], files: ['assets/images/logo.png']})
      .catch(function(err) {
          fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
          });
      });
  }
}