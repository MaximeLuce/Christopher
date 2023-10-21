const { Permissions } = require("discord.js");
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'send',
  aliases: ['envoyer'],
  description: 'Utilisation : &envoyer identifiant message | Permet d\'envoyer un message avec Christopher dans le salon dont on a fourni l\'identifiant.',
  execute: (client, message, args) => {
    if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

    if(!args[0]) return message.channel.send("Il va me falloir un identifiant de salon !")

    const arguments = args.splice(1).join(' ')
    client.channels.cache.get(args[0]).send(arguments)
      .catch(function(err) {
          fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
          });
      });
  }
}