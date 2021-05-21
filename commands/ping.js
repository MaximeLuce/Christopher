exports.run = async (client, message) => {
    const msg = "Votre Ping est de : " + Math.round(client.ws.ping) + ' ms.';
  message.channel.send(msg)
}

exports.help = {
  name: 'ping'
}
