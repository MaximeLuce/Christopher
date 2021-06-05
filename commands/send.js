const { perms } = require('../config.json')

exports.run = (client, message, args) => {
  if (!message.member.roles.cache.some(r => r.id == 673268660458094603) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")


  const arguments = args.splice(1).join(' ')
  client.channels.cache.get(args[0]).send(arguments)
}

exports.help = {
  name: 'send'
}
