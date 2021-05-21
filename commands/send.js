const { perms } = require('../config.json')

exports.run = (client, message, args) => {
  if (!perms.includes(message.author.id)) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")


  const arguments = args.splice(1).join(' ')
  client.channels.cache.get(args[0]).send(arguments)
}

exports.help = {
  name: 'send'
}
