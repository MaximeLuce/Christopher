const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'kick',
    aliases: ['expulser'],
    description: 'Utilisation : &expulser utilisateur motif | Permet d\'expulser l\'utilisateur mentionné en paramètre avec le motif donné.',
    execute: async (client, message, args) => {
    if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")
        const connection = []

        if(message.mentions.users.size === 0) return message.channel.send("Tu dois mentionner un utilisateur !")
        
        const reason = args.slice(1).join(' ') || `Manquement au règlement`

        const kick = message.guild.members.cache.get(message.mentions.users.first().id)

        if(!kick) return message.channel.send('Utilisateur introuvable !')

        if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.channel.send("Je n'ai pas la permission pour kick !");
        }
        
        if(!kick.kickable) {
            return message.channel.send("Kick impossible !");
        }

        try{
            const embed = new EmbedBuilder()
            .setColor('#3867d6')
            .setTitle("KICK !")
            .setDescription(`Vous avez été kick du Max de Culture`)
            .addField(`Raison :`, reason)
            .setTimestamp()
            await kick.send({embeds: [embed]})
          } catch {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                if(err) throw err;
            });
          }
        kick.kick(reason).then(member => {
            message.channel.send(`**${member.user.tag}** a été kick par **${message.author.tag}** pour **${reason}**`)
                .catch(function(err) {
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                });

            const date = new Date();
            let jour = ("0" + date.getDate()).slice(-2);
            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
            let heure = ("0" + date.getHours()).slice(-2);
            let minute = ("0" + date.getMinutes()).slice(-2);
            let secondes = ("0" + date.getSeconds()).slice(-2);
            affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;

            client.channels.cache.get(constantes["suivi"]).send('**[Kick - <@'+message.author.id+'>]** '+affTime+', <@'+member.user.id+'> : '+reason)
                .catch(function(err) {
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                });

            const embed2 = new EmbedBuilder()
              .setColor('#3867d6')
              .setTitle("KICK !")
              .addFields({name: 'User :', value: member.user.tag},
                        {name: 'Banni par :', value: message.author.tag},
                        {name: 'Raison :', value: reason})
              .setTimestamp()

            client.channels.cache.get(constantes["logs_arr"]).send({embeds: [embed2]})
                .catch(function(err) {
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                });
        }).catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });

        connection.push(createConnection({
            host: config.connexion.host,
            user: config.connexion.user,
            password: config.connexion.password,
            database: config.connexion.database
          }));
        connection[0].query(`INSERT INTO commun_suivi (modo, membre, motif, type, date) VALUES (?, ?, ?, ?, ?)`, 
            [message.author.id, kick.user.id, reason, 3, Math.round(Date.now()/1000)], 
            function(err, results){
                if(err){
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                }
            })
        connection[0].end()
        connection.shift()
    }
}