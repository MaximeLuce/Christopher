const { PermissionsBitField } = require('discord.js');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'fossile',
  aliases: [],
  description: 'Utilisation : &fossile id | Permet au membre à l\'id renseigné de faire partie des fossiles.',
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

    if(!args[0]){
      message.channel.send("Il me faut l'id d'un membre.")
    } else {
      let membre = client.users.resolve(args[0]);
      client.channels.cache.get('676886661518589984').permissionOverwrites.create(membre, {
        ViewChannel: true,
        SendMessages: true
      })
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
      client.channels.cache.get('745932018470223953').permissionOverwrites.create(membre, {
        ViewChannel: true,
        SendMessages: true
      })
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
      client.channels.cache.get('745921152483983380').permissionOverwrites.create(membre, {
        ViewChannel: true,
        Connect: true
      })
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
      message.channel.send(`<@${membre.id}> est maintenant un fossile !`);
    }
  }
}