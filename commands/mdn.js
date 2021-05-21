const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

exports.run = async (_client, message, args) => {

    if (!args[0]) {
        message.channel.send("Veuillez indiquer une recherche !")
        return
      }

  
      const res = await fetch(`https://developer.mozilla.org/api/v1/search/fr?q=${encodeURIComponent(args.join(' '))}&locale=fr`)
      const body = await res.json()

      if (!body.documents.length) {
        message.channel.send('Aucun résultat trouvé')
        return
      }

      const array = body.documents.map(element => `â€¢ \`${element.title}\` - [[Cliquez ici]](https://developer.mozilla.org/fr/docs/${element.slug})`)

      array.slice(0, 5)

  const mdn = new MessageEmbed()
    .setTitle("Recherche MDN")
    .setDescription(array.join(' \n'))
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .setTimestamp()
  message.channel.send(mdn)
}

exports.help = {
  name: 'mdn'
}