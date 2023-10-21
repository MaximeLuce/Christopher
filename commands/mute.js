const { EmbedBuilder, Permissions } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'mute',
    aliases: ['taggle'],
    description: 'Utilisation : &mute utilisateur motif [durée en minutes] | Permet de retirer le droit de s\'exprimer à l\'utilisateur mentionné avec le motif spécifié.',
    execute: async (client, message, args) => {
        const connection = []

        var duree = 0;

        if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if(message.mentions.users.size === 0) return message.channel.send("Tu dois mentionner un utilisateur !");

        const mute = message.guild.members.cache.get(message.mentions.users.first().id);

        if(Number.isInteger(parseInt(args.slice(-1)[0]))){
            duree = args.pop();
        }
        
        const reason = args.slice(1).join(' ') || `Manquement au règlement`

        if(!mute) return message.channel.send('Cet utilisateur n\'existe pas !')

        try{
            const embed = new EmbedBuilder()
            .setColor('#3867d6')
            .setTitle("Mute !")
            .setDescription(`Vous avez été mute sur le Max de Culture`)
            .addField(`Raison : `, reason)
            .setFooter({text: 'Pour toute contestation, n\'hesitez pas à contacter un membre de l\'équipe.'})
            .setTimestamp();
            mute.send({embeds: [embed]})
        } catch {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                if(err) throw err;
            });
        }

        mute.roles.add('732136692085030912').then(member => {
            message.channel.send(`**${member.user.tag}** a été mute par **${message.author.tag}** pour **${reason}**`)
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

            client.channels.cache.get(constantes["suivi"]).send('**[Mute - <@'+message.author.id+'>]** '+affTime+', <@'+member.user.id+'> : '+reason)
                .catch(function(err) {
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                });
            
            const embed2 = new EmbedBuilder()
              .setColor('#3867d6')
              .setTitle("Mute !")
              .addFields({name: 'User :', value: member.user.tag},
                        {name: 'Muted par :', value: message.author.tag},
                        {name: 'Raison :', value: reason})
              .setTimestamp();

            client.channels.cache.get(constantes["logs_chris"]).send({embeds: [embed2]})
                .catch(function(err) {
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
                [message.author.id, member.user.id, reason, 2, Math.round(Date.now()/1000)], 
                function(err, results){
                    if(err){
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                })

            connection[0].end()
            connection.shift()

            if(duree != 0){
                connection.push(createConnection({
                    host: config.connexion.host,
                    user: config.connexion.user,
                    password: config.connexion.password,
                    database: config.connexion.database
                  }));

                var time = new Date().getTime()
                time = time/1000+duree*60

                connection[0].query(`INSERT INTO chris_msg_auto (timestamp, auteur, salon, message) VALUES (?, ?, ?, ?)`, 
                    [time, 0, 0, member.user.id], 
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
        });
    }
}