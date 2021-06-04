const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message, args) => {

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
    
  return message.channel.send(new MessageEmbed()
    .setTimestamp()
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .addField(':game_die: | Et le tirage est ...', r)
  )
}

exports.help = {
  name: 'dé'
}
