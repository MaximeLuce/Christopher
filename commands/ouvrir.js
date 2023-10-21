const { Permissions } = require('discord.js')
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'ouvrir',
  aliases: ['open'],
  description: 'Permet de rouvrir un salon aux réponses.',
  execute: async (client, message) => {
    if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")
    client.channels.cache.get(message.channel.id).permissionOverwrites.cache.get(message.channel.guild.roles.everyone.id).delete()
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
    client.channels.cache.get(message.channel.id).permissionOverwrites.cache.get(constantes['sentinelle']).delete()
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
    const msg = "Le salon a bien été rouvert.";
    message.channel.send(msg)
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
  }
}