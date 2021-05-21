const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

exports.run = async (_client, message, args) => {

    if (!args[0]) {
        message.channel.send("Veuillez indiquer un sondage !")
        return
      }
  
      const arrayPoll = args.join(' ').split(';')
      const question = arrayPoll[0]
  
      if (question.length > 400) {
        message.channel.send("Votre question est trop longue !")
        return
      }
  
      arrayPoll.shift()
  
      if (arrayPoll.length < 2) {
        message.channel.send("Il faut au moins deux réponses possibles !")
        return
      }
  
      if (arrayPoll.length > 30) {
        message.channel.send("Il ne faut pas plus de 30 réponses")
        return
      }
  
      for (const element of arrayPoll) {
        if (element.length > 400) {
          message.channel.send("Une réponse ne doit pas excéder 400 caractères !")
          return
        }
        if (element.trim().length <= 0) {
          arrayPoll.splice(arrayPoll.indexOf(element), 1)
        }
      }

      const res = await fetch('https://www.strawpoll.me/api/v2/polls', {
        method: 'POST',
        body: JSON.stringify({
          title: question,
          options: arrayPoll,
          multi: true,
          dupcheck: 'normal',
          captcha: true
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      const body = await res.json()

      if (!body.id) {
        message.channel.send("Une erreur est survenue, merci de r��sayer plus tard !")
        return
      }

  const strawpoll = new MessageEmbed()
    .setTitle('Strawpoll')
    .addField("Lien :", `[[Cliquez ici]](https://www.strawpoll.me/${body.id})`)
    .setColor('#3867d6')
    .attachFiles(['assets/images/logo.png'])
    .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    .setTimestamp()
  message.channel.send(strawpoll)
}

exports.help = {
  name: 'strawpoll'
}