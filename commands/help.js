const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'aide',
  aliases: ['help', '?'],
  description: 'Utilisation : &aide [commande] | Permet d\'afficher la liste des commandes, si le paramètre est donné, affiche l\'aide relative à une commande.',
  execute: async (client, message, args) => {
    if(!args[0]){
      const help = new EmbedBuilder()
        .setTitle('Voici mes commandes pour vous aider :')
        .addFields({name: ':gear: | Utilitaires', value: '```aide \ncitation \nitunes \nmdn \nmeteo \nping \nstrawpoll \nwikipedia```', inline: true},
                  {name: ':game_die: | Détente', value: '```dé \ndemineur \npfc \nquestion```', inline: true},
                  {name: ':newspaper: | Info', value: '```avatar \nlien \nserveur \nsite \nutilisateur \nquestion-stats```', inline: true},
                  {name: '<:modo:574587003836825631> | Modération', value: '```mute \nunmute \nkick \nban \nfetch-ban \nanniversaire \nmessage-automatique \nsuivi \nsuivi-recap```', inline: true})
        .setColor('#3867d6')
        .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
        .setTimestamp()
      message.channel.send({embeds: [help], files: ['assets/images/logo.png']})
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
    } else {
      const name = args[0].toLowerCase();
      const command = client.commands.get(name) || client.commands.get(client.aliases.get(name));

      if (!command) {
        return message.reply(`Cette commande n'existe pas.`);
      }

      if(command.aliases == ''){
        aliases = "Aucun alias";
      } else{
        var aliases = command.aliases.join(', ');
      }

      const infos = new EmbedBuilder()
        .setTitle(`Informations sur la commande ${name}`)
        .addFields({name: 'Nom de la commande', value: `${command.name}`},
                    {name: 'Alias', value: `${aliases}`},
                    {name: 'Description', value: `${command.description}`})
        .setColor('#3867d6')
        .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
        .setTimestamp()
      message.channel.send({embeds: [infos], files: ['assets/images/logo.png']})
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
    }

    // message.channel.send("Les commandes ne fonctionnent pas pour le moment, veuillez patienter.")
  }
}
