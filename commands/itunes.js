const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

exports.run = async (_client, message, args) => {

    if (!args[0]) {
        message.channel.send("Veuillez indiquer une musique !")
        return
      }

    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(args.join(' '))}&media=music&entity=song&limit=1&explicit=${message.channel.nsfw ? 'yes' : 'no'}`)
      const body = await res.json()

      if (!body.resultCount) {
        message.channel.send('Aucun résultat trouvé !')
        return
      }

    const data = body.results[0]

  const help = new MessageEmbed()
    .setURL(data.trackViewUrl)
    .setThumbnail(data.artworkUrl100)
    .setTitle(data.trackName)
    .addField("Artiste :", data.artistName)
    .addField("Album :", data.collectionName)
    .addField("Date de sortie :", data.releaseDate)
    .addField("Genre :", data.primaryGenreName)
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .setTimestamp()
  message.channel.send(help)
}

exports.help = {
  name: 'itunes'
}