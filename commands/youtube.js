const { EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// const decode = require('decode-html')

module.exports = {
  name: 'youtube',
  aliases: ['yt'],
  description: 'Utilisation : &youtube mots-clefs | Permet d\'effectuer une recherche sur Youtube avec le paramètre donné.',
  execute: async (_client, message, args) => {
    if (!args[0]) {
      message.channel.send("Veuillez indiquer une recherche Wikipédia !")
      return
    }

    const argument = args.join(' ')

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyCZWDgdEs93HD2LZsR36YDGxM-O7GWafgQ&q=${encodeURIComponent(argument)}&type=video`)
    const body = await res.json()

    // console.log(body.items.length)

    // if (body.query.pages[0].missing) {
    //   message.channel.send("Cette recherche n'a rien donné !")
    //   return
    // }

    message.channel.send(`Voici les cinq premiers résultats pour la recherche : « ${argument} ».`);

    for (var i = 0; i < body.items.length; i++) {
      const youtube = new EmbedBuilder()
        .setTitle(`:label: • Titre : ${body.items[i].snippet.title}`)
        .setColor('#3867d6')
        .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
        .addFields({name: `Chaîne : ${body.items[i].snippet.channelTitle}`, value: `[[Cliquez ici]](https://youtu.be/${encodeURIComponent(body.items[i].id.videoId)})`})
        .setTimestamp()
        .setThumbnail(body.items[i].snippet.thumbnails.high.url)
      
      message.channel.send({embeds: [youtube], files: ['assets/images/logo.png']})
    }

  }
}