const { EmbedBuilder } = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const date = require('date')

module.exports = {
  name: 'itunes',
  aliases: [],
  description: 'Utilisation : &itunes titre | Cherche les informations relatives à la chanson donnée en paramètre.',
  execute: async (_client, message, args) => {

    if (!args[0]) {
      return message.channel.send("Veuillez indiquer une musique !")
    }

    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(args.join(' '))}&media=music&entity=song&limit=1`)
    const body = await res.json()

    if (!body.resultCount) {
      return message.channel.send('Aucun résultat trouvé !')
    }

    const data = body.results[0]

    var date = Date.parse(data.releaseDate)/1000
    date = new Date(date)
    var date2 = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()

    const help = new EmbedBuilder()
      .setURL(data.trackViewUrl)
      .setThumbnail(data.artworkUrl100)
      .setTitle(data.trackName)
      .addFields({name: "Artiste :", value: data.artistName},
                {name: "Album :", value: data.collectionName},
                {name: "Date de sortie :", value: date2},
                {name: "Genre :", value: data.primaryGenreName})
      .setColor('#3867d6')
      .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
      .setTimestamp()
    message.channel.send({embeds: [help], files: ['assets/images/logo.png']})
  }
}
