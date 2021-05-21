const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

exports.run = async (_client, message, args) => {

    if (!args[0]) {
        message.channel.send("Veuillez indiquer une recherche Wikipédia !")
        return
      }

      const res = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(args.join(' '))}&prop=extracts&formatversion=2&exintro=&explaintext=&redirects=`)
      const body = await res.json()

      if (body.query.pages[0].missing) {
        message.channel.send("Cette recherche n'a rien donné !")
        return
      }

  const wiki = new MessageEmbed()
    .setTitle(`:label: • ${body.query.pages[0].title}`)
    .setDescription(body.query.pages[0].extract.substr(0, 1900).replace(/[\n]/g, '\n\n'))
    .addField("Lien :", `[[Cliquez ici]](https://fr.wikipedia.org/wiki/${encodeURIComponent(body.query.pages[0].title)})`)
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .setTimestamp()
  message.channel.send(wiki)
}

exports.help = {
  name: 'wikipedia'
}