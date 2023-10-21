const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'dé',
  aliases: ['de', 'dice', 'rand', 'random'],
  description: 'Utilisation &dé [borne1] [borne2] | Permet d\'effectuer un tirage aléatoire, par défaut entre 1 et 6, sinon entre 1 et la borne donnée, sinon entre la borne 1 et la borne 2, si la borne1 est une lettre, tire une lettre au hasard.',
  execute: async (_client, message, args) => {

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomLetter(){
      return String.fromCharCode(getRandomIntInclusive(65,90));
    }

    let r = "";
    if(args.length === 0){
      r = getRandomIntInclusive(1,6);
    }
    else if(args.length === 2 && args[0] == parseInt(args[0]) && args[1] == parseInt(args[1])){
      r = getRandomIntInclusive(args[0],args[1]);
    }
    else if(args.length === 1 && args[0] == parseInt(args[0])) {
      r = getRandomIntInclusive(0,args[0]);
    }
    else {
      r = getRandomLetter();
    }

    const embed = new EmbedBuilder()
      .setTimestamp()
      .setColor('#3867d6')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
      .addFields({name: ':game_die: | Et le tirage est ...', value: r.toString()})
      
    return message.channel.send({embeds: [embed], files: ['assets/images/logo.png']})
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
  }
}