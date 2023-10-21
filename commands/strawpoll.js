const { EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'strawpoll',
  aliases: ['vote', 'sondage'],
  description: '[INDISPONIBLE] Utilisation : &vote question;réponse1;réponse2;réponse3;... | Crée un sondage strawpoll avec les informations correspondantes.',
  execute: async (_client, message, args) => {

    return message.reply("Désolé, le sondage n'est plus disponible pour le moment !")

    // if (!args[0]) {
    //   return message.channel.send("Veuillez indiquer un sondage !")
    // }

    // const arrayPoll = args.join(' ').split(';')
    // const question = arrayPoll[0]

    // if (question.length > 400) {
    //   return message.channel.send("Votre question est trop longue !")
    // }

    // arrayPoll.shift()

    // if (arrayPoll.length < 2) {
    //   return message.channel.send("Il faut au moins deux réponses possibles !")
    // }

    // if (arrayPoll.length > 30) {
    //   return message.channel.send("Il ne faut pas plus de 30 réponses")
    // }

    // for (const element of arrayPoll) {
    //   if (element.length > 400) {
    //     return message.channel.send("Une réponse ne doit pas excéder 400 caractères !")
    //   }
    //   if (element.trim().length <= 0) {
    //     arrayPoll.splice(arrayPoll.indexOf(element), 1)
    //   }
    // }

    // const res = await fetch('https://api.strawpoll.com/v3/polls', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     title: question,
    //     options: arrayPoll,
    //     multi: true,
    //     dupcheck: 'normal',
    //     captcha: true
    //   }),
    //   headers: { 'Content-Type': 'application/json' }
    // })
    // const body = await res.json()

    // if (!body.id) {
    //   return message.channel.send("Une erreur est survenue, merci de réessayer plus tard !")
    // }

    // const strawpoll = new EmbedBuilder()
    //   .setTitle('Strawpoll')
    //   .addField("Lien :", `[[Cliquez ici]](https://www.strawpoll.me/${body.id})`)
    //   .setColor('#3867d6')
    //   .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
    //   .setTimestamp()
    // message.channel.send({embeds: [strawpoll], files: ['assets/images/logo.png']})
    //   .catch(function(err) {
    //     fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
    //       if(err) throw err;
    //     });
    //   });
  }
}