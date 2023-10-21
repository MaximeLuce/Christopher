const { EmbedBuilder, Permissions } = require("discord.js");
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'unmute',
    aliases: ['demute'],
    description: 'Utilisation : &unmute utilisateur | Permet de redonner le droit de s\'exprimer à l\'utilisateur mentionné.',
    execute: async (client, message, args) => {
        if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if(message.mentions.users.size === 0) return message.channel.send("Tu dois mentionner un utilisateur !");
        
        const mute = message.guild.members.cache.get(message.mentions.users.first().id);

        if(!mute) return message.channel.send('Cet utilisateur n\'existe pas !')

        try{
            mute.send("Vous pouvez de nouveau parler sur le Max de Culture");
        } catch {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                if(err) throw err;
            });
        }
        mute.roles.remove('732136692085030912').then(member => {
            message.channel.send(`**${member.user.tag}** a été unmute par **${message.author.tag}**`)

            const embed = new EmbedBuilder()
              .setColor('#3867d6')
              .setTitle("Unmute !")
              .addFields({name: 'User :', value: member.user.tag},
                        {name: 'Unmuted par :', value: message.author.tag})
              .setTimestamp()
            
            client.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed]})
              .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                  if(err) throw err;
                });
              })
        });

    }
}