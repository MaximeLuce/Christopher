const quote = require('../assets/quote.json')

exports.run = async (_client, message) => {
  message.channel.send(quote[Math.floor(Math.random() * quote.length)])
}

exports.help = {
  name: 'citation'
}
