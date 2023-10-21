const { EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'mdn',
  aliases: [],
  description: '[INDISPONIBLE] Utilisation : &mdn mots-clefs | Effectue une recherche sur le MDN Web Docs de Mozilla avec le paramètre donné.',
  execute: async (_client, message, args) => {

    return message.channel.send('**Indisponible pour le moment, désolé du dérangement !**')

  //   if (!args[0]) {
  //     return message.channel.send("Veuillez indiquer une recherche !")
  //   }
  
  //   const res = await fetch(`https://developer.mozilla.org/api/v1/search/fr?q=${encodeURIComponent(args.join(' '))}&locale=fr`)
  //   const body = await res.json()

  //   if (!body.documents.length) {
  //     return message.channel.send('Aucun résultat trouvé')
  //   }

  //   const array = body.documents.map(element => `â€¢ \`${element.title}\` - [[Cliquez ici]](https://developer.mozilla.org/fr/docs/${element.slug})`)
  //           .catch(function(err) {
  //               fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
  //                   if(err) throw err;
  //               });
  //           });

  //   array.slice(0, 5)

  //   const mdn = new EmbedBuilder()
  //     .setTitle("Recherche MDN")
  //     .setDescription(array.join(' \n'))
  //     .setColor('#3867d6')
  //     .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
  //     .setTimestamp()
  //   message.channel.send({embeds: [mdn], files: ['assets/images/logo.png']})
  //           .catch(function(err) {
  //               fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
  //                   if(err) throw err;
  //               });
  //           });
  }
}