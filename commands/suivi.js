const { Permissions } = require('discord.js');
const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")
const constantes = require('../assets/constantes.json');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'suivi',
    aliases: [],
    description: 'Utilisation: &suivi identifiant type motif | Enregistre un acte de modération du membre dont l\'identifiant est saisi, avec un type parmi ceux prédéfinis (autre, avertissement, mute, kick, ban, suppression) ou tapé manuellement et motivé par le motif donné.',
    execute: async (client, message, args) => {
        const connection = []

        if (!message.member.roles.cache.has(constantes['sentinelle'])) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        const time = Math.round(Date.now()/1000);

        const modo = message.author.id.toString();

        if (!args[0]) return message.channel.send('Tu dois indiquer l\'id du membre !');

        const membre = args[0];

        if(!args[1]) return message.channel.send('Tu dois indiquer un type de sanction.');

        const t = args[1].toLowerCase();

        let type;
        let motif;

        if (!args[2]) return message.channel.send('Tu dois indiquer un motif !\nSi tu dis pas ça c\'est comme si t\'avais rien dit, alors te fatigue pas, dis-le pas\nC\'est comme si j\'disais : \"Quelle est la différence entre un hamburger ?\"\nTu vois bien qu\'y\'a un problème');

        args.shift();
        args.shift();

        switch(t) {
            case 'avertissement':
                type = 1;
                motif = args.join(' ');
                break;
            case 'mute':
                type = 2;
                motif = args.join(' ');
                break;
            case 'kick':
                type = 3;
                motif = args.join(' ');
                break;
            case 'ban':
                type = 4;
                motif = args.join(' ');
                break;
            case 'suppression':
                type = 5;
                motif = args.join(' ');
                break;
            default:
                type = 0;
                motif = t+' '+args.join(' ');
                break;
        }

        connection.push(createConnection({
            host: config.connexion.host,
            user: config.connexion.user,
            password: config.connexion.password,
            database: config.connexion.database
          }));
        connection[0].query(`INSERT INTO commun_suivi (modo, membre, motif, type, date) VALUES (?, ?, ?, ?, ?)`, 
            [modo, membre, motif, type, time], 
            async function(err, results) {
                if(err){
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                    });
                }
            })
        connection[0].end()
        connection.shift()
        
        let affType, affTime

        switch(type){
            case 1:
                affType = "Avertissement";
                break;
            case 2: 
                affType = "Mute";
                break;
            case 3: 
                affType = "Kick";
                break;
            case 4: 
                affType = "Ban";
                break;
            case 5: 
                affType = "Suppression";
                break;
            default: 
                affType = motif.split(' ')[0];
                break;
        }

        const date = new Date(time*1000);

        let jour = ("0" + date.getDate()).slice(-2);
        let mois = ("0" + (date.getMonth() + 1)).slice(-2);
        let heure = ("0" + date.getHours()).slice(-2);
        let minute = ("0" + date.getMinutes()).slice(-2);
        let secondes = ("0" + date.getSeconds()).slice(-2);

        affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;

        client.channels.cache.get(constantes["suivi"]).send('**['+affType+' - <@'+modo+'>]** '+affTime+', <@'+membre+'> : '+motif)
          .catch(function(err) {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
            });
          });

        return message.channel.send(`Suivi correctement effectué.`)
          .catch(function(err) {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
            });
          });
    }
}