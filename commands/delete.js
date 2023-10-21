const { EmbedBuilder, Permissions } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'delete',
    aliases: ['supprimer', 'supp', 'clear', 'clean', 'cl', 'del'],
    description: 'Utilisation : &supprimer [nombre] [mention utilisateur] => supprime les messages de la personne mentionnée parmi les n derniers messsages (ou tous les n)',
    execute: async (client, message, args) => {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        const membre = (message.mentions.users.size === 0) ? null : message.guild.members.cache.get(message.mentions.users.first().id).user

        const channel = message.channel;
        let limite;
        let c = 0
        
        if(!args[0]){
            limite = 1;
        }
        else{
            limite = args[0];
        }

        let messages = [];

        // Create message pointer
        let mess = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null))
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });

        while (c < limite) {
            await channel.messages
                .fetch({ limit: 1, before: mess.id })
                .then(messagePage => {
                    messagePage.forEach(msg => {
                        if(membre == null || membre == msg.author){
                            msg.delete()
                        }
                    });
                
                    // Update our message pointer to be last message in page of messages
                    mess = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                })
                .catch(function(err) {
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                });
            c++;
        }
    }
}