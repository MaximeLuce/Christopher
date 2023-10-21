const { EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'wikipedia',
  aliases: ['wiki'],
  description: 'Utilisation : &wiki mots-clefs | Permet d\'effectuer une recherche sur Wikipedia avec le paramètre donné.',
  execute: async (_client, message, args) => {
    if (!args[0]) {
      return message.channel.send("Veuillez indiquer une recherche Wikipédia !")
    }

    const res = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(args.join(' '))}&prop=extracts&formatversion=2&exintro=&explaintext=&redirects=`)
    const body = await res.json()

    if (body.query.pages[0].missing) {
      return message.channel.send("Cette recherche n'a rien donné !")
    }

    const wiki = new EmbedBuilder()
      .setTitle(`:label: • ${body.query.pages[0].title}`)
      .setDescription(body.query.pages[0].extract.substr(0, 1900).replace(/[\n]/g, '\n\n'))
      .addFields({name: "Lien :", value: `[[Cliquez ici]](https://fr.wikipedia.org/wiki/${encodeURIComponent(body.query.pages[0].title)})`})
      .setColor('#3867d6')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
      .setTimestamp()
    message.channel.send({embeds: [wiki], files: ['assets/images/logo.png']})
      .catch(function(err) {
        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
          if(err) throw err;
        });
      })
  }
}