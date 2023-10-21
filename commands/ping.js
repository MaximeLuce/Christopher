const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'ping',
  aliases: ['pong'],
  description: 'Utilisation : &ping | Donne le temps de réponse de Christopher en millisecondes.',
  execute: async (client, message) => {
    const msg = "Votre Ping est de : " + Math.round(client.ws.ping) + ' ms.';
    message.channel.send(msg)
  }
}