const { createConnection } = require('mysql2');
const config = require('../config.json')
const moment = require("date")

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.some(r => r.id == 673268660458094603) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if (!args[0]) return message.channel.send('Il va me falloir un paramètre : date (jj/mm/aaaa), id de membre ou type de sanction !');

        const arg = args[0];

        let tab = ["autre", "avertissement", "mute", "kick", "ban", "suppression"];

        if(parseInt(arg, 10) == arg){
            connection.query(
                `SELECT * FROM modlogs WHERE membre = ?`,
                [arg],
                async function(err, results) {
                    if(results.length === 0){
                        message.channel.send('Aucun résultat.');
                    } else {
                        results.forEach(e => {
                            affType = tab[e.type];
                            affType = affType[0].toUpperCase()+affType.slice(1);
                            affModo = client.users.resolve(e.modo);
                            affMembre = client.users.resolve(e.membre);
                            const date = new Date(e.date*1000);
                            let jour = ("0" + date.getDate()).slice(-2);
                            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                            let heure = ("0" + date.getHours()).slice(-2);
                            let minute = ("0" + date.getMinutes()).slice(-2);
                            let secondes = ("0" + date.getSeconds()).slice(-2);
                            affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;
                            if(affModo.id && affMembre.id){
                                message.channel.send('**['+affType+' - <@'+affModo.id+'>]** '+affTime+', <@'+affMembre.id+'> : '+e.motif);
                            }
                        })
                        
                    }
                }
            )
        } else if(tab.includes(arg)) {
            connection.query(
                `SELECT * FROM modlogs WHERE type = ?`, 
                [tab.indexOf(arg)],
                async function(err, results) {
                    if(results.length === 0){
                        message.channel.send('Aucun résultat.');
                    } else {
                        results.forEach(e => {
                            affType = tab[e.type];
                            affType = affType[0].toUpperCase()+affType.slice(1);
                            affModo = client.users.resolve(e.modo);
                            affMembre = client.users.resolve(e.membre);
                            const date = new Date(e.date*1000);
                            let jour = ("0" + date.getDate()).slice(-2);
                            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                            let heure = ("0" + date.getHours()).slice(-2);
                            let minute = ("0" + date.getMinutes()).slice(-2);
                            let secondes = ("0" + date.getSeconds()).slice(-2);
                            affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;
                            if(affModo.id && affMembre.id){
                                message.channel.send('**['+affType+' - <@'+affModo.id+'>]** '+affTime+', <@'+affMembre.id+'> : '+e.motif);
                            }
                        })
                        
                    }
                }
            )
        } else {
            let myDate = arg.split('/');
            let myTime = new Date(myDate[2], myDate[1] - 1, myDate[0]).getTime();
            let mintime = Math.round(myTime/1000);
            let maxtime = mintime+86400;
            connection.query(
                `SELECT * FROM modlogs WHERE date < ? AND date > ?`,
                [maxtime, mintime],
                async function(err, results) {
                    if(results.length === 0){
                        message.channel.send('Aucun résultat.');
                    } else {
                        results.forEach(e => {
                            affType = tab[e.type];
                            affType = affType[0].toUpperCase()+affType.slice(1);
                            affModo = client.users.resolve(e.modo);
                            affMembre = client.users.resolve(e.membre);
                            const date = new Date(e.date*1000);
                            let jour = ("0" + date.getDate()).slice(-2);
                            let mois = ("0" + (date.getMonth() + 1)).slice(-2);
                            let heure = ("0" + date.getHours()).slice(-2);
                            let minute = ("0" + date.getMinutes()).slice(-2);
                            let secondes = ("0" + date.getSeconds()).slice(-2);
                            affTime = jour+'/'+mois+'/'+date.getFullYear()+' '+heure+':'+minute+':'+secondes;
                            if(affModo.id && affMembre.id){
                                message.channel.send('**['+affType+' - <@'+affModo.id+'>]** '+affTime+', <@'+affMembre.id+'> : '+e.motif);
                            }
                        })
                        
                    }
                }
            )
        } 
}

exports.help = {
  name: 'suivi-recap'
}
