const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'alexis',
  aliases: ['alex'],
  description: 'Commande du bot pour une énigme à destination d\'Alexis',
  execute: async (client, message) => {
      const msg = "Pour l\'indice du 19/08/2020, Ellie ne te sera d\'aucune utilité alors que le paranoïaque (un peu fort) qui répondait au nom de Bill...";
      message.channel.send(msg)
      const channel = client.channels.cache.get("777998621219618846");
      // channel.messages.fetch({ limit: 100 }).then(messages => {
      //   console.log(`Received ${messages.size} messages`);
      //   //Iterate through the messages here with the variable "messages".
      //   messages.forEach(message => console.log(message.content))
      //     .catch(function(err) {
      //         fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
      //             if(err) throw err;
      //         });
      //     });
      // }).catch(function(err) {
      //       fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
      //           if(err) throw err;
      //       });
      //   });
    }
}