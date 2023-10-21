const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'lien',
  aliases: ['url', 'link', 'links', 'liens'],
  description: 'Utilisation : &liens | Affiche la liste des liens relatifs au Max De Culture.',
  execute: async (_client, message) => {
        const avatarEmbed = new EmbedBuilder()
            .setColor('#3867d6')
            .setTitle('<:lmdc:750836302823293010> Les liens du projet <:lmdc:750836302823293010>')
            .addFields({name: 'Le Site', value: `https://le-max-de-culture.fr/`, inline: true},
                      {name: 'Discord', value: `https://discord.gg/4VhPeBZ (lien permanent)`, inline: true},
                      {name: 'Twitter', value: `https://twitter.com/LeMaxDeCulture`, inline: true},
                      {name: 'Facebook', value: `https://www.facebook.com/Le-Max-De-Culture-112009136970590/`, inline: true},
                      {name: 'Instagram ', value: `https://www.instagram.com/le.max.de.culture/?hl=fr`, inline: true},
                      {name: 'La Chaîne Youtube', value: `https://www.youtube.com/channel/UCcUIG4QC68iMr6iEEXVd8MQ`, inline: true})
            .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
        message.channel.send({embeds: [avatarEmbed], files: ['assets/images/logo.png']})
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
    }
}