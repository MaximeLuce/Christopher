const { EmbedBuilder, Permissions } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'fetch-ban',
  aliases: [],
  description: 'fetch-ban : Utilisation : &fetch-ban utilisateur motif | Permet de bannir l\'utilisateur dont l\'identifiant est en paramètre avec le motif donné.',
  execute: async (client, message, args) => {
    const connection = []
    if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if(!args[0]) return message.channel.send("Tu dois m'indiquer un ID !")
        
        const reason = args.slice(1).join(' ') || `Manquement au règlement`

        if(!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers))
            return message.channel.send("Je n'ai pas la permission pour ban !");

        try {
            const ban = await client.users.fetch(args[0])

            message.guild.members.ban(ban.id, { reason: reason }).then(user => {
                message.channel.send(`**${user.tag}** a été banni par **${message.author.tag}** pour **${reason}**`)

                const date = new Date();
                let jour = ("0" + date.getDate()).slice(-2);
                let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                let heure = ("0" + date.getHours()).slice(-2);
                let minute = ("0" + date.getMinutes()).slice(-2);
                let secondes = ("0" + date.getSeconds()).slice(-2);
                affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;

                client.channels.cache.get(constantes["suivi"]).send('**[Fetch-ban - <@'+message.author.id+'>]** '+affTime+', <@'+user.id+'> : '+reason);
    
                const embed = new EmbedBuilder()
                  .setColor('#3867d6')
                  .setTitle("BAN !")
                  .addFields({name: 'User :', value: user.tag},
                            {name: 'Banni par :', value: message.author.tag},
                            {name: 'Raison :', value: reason})
                  .setTimestamp()

                client.channels.cache.get(constantes["logs_arr"]).send({embeds: [embed]})
                    .catch(function(err) {
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    });
            })
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
                [message.author.id, ban.id, reason, 4, Math.round(Date.now()/1000)], 
                function(err, results){
                    if(err){
                        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                            if(err) throw err;
                        });
                    }
                })
            connection[0].end()
            connection.shift()

        } catch (error){
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                if(err) throw err;
            });
        }

    }
}