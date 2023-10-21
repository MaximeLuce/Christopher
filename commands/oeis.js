const { EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'oeis',
  aliases: [],
  description: 'Utilisation : &oeis suite de nombres séparés par des virgules (sans espace)',
  execute: async (_client, message, args) => {
    if (!args[0]) {
      return message.channel.send("Veuillez indiquer une recherche !")
    }

    let argument = args.join('')

    const res = await fetch(`https://oeis.org/search?fmt=json&q=${encodeURIComponent(argument)}`)
    const body = await res.json()

    if (body.count == 0) {
      return message.channel.send("Cette recherche n'a rien donné !")
    }
    if(body.results == null){
      return message.channel.send(`Trop de résultats (${body.count}), je ne peux rien afficher !`)
    }

    const wiki = new EmbedBuilder()
      .setTitle(`Nombre de résultats : ${body.count}. Voici le premier :`)
      .setDescription(body.results[0].name)
      .addFields({name: "Lien :", value: `[[A${body.results[0].number}]](https://oeis.org/A${body.results[0].number})`},
                  {name: "Début de la suite :", value: `${body.results[0].data}`})
      .setColor('#3867d6')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
      .setTimestamp()
    message.channel.send({embeds: [wiki], files: ['assets/images/logo.png']})
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
  }
}