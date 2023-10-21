const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'fox',
  aliases: [],
  description: '',
  execute: async (client, message, args) => {
    let membre = client.users.resolve('241945809460002817');
    client.channels.cache.get(constantes['report']).permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    });
    client.channels.cache.get(constantes['suivi']).permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    });
    client.channels.cache.get(constantes['logs_arr']).permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    });
    client.channels.cache.get(constantes['logs_reac']).permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    });
    client.channels.cache.get(constantes['logs_chris']).permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    });
    client.channels.cache.get(constantes['office']).permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    });
    client.channels.cache.get('640141275466825728').permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    });

  }
}