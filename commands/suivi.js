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

        const time = Math.round(Date.now()/1000);

        const modo = message.author.id;

        if (!args[0]) return message.channel.send('Tu dois indiquer l\'id du membre !');

        const membre = args[0];

        if(!args[1]) return message.channel.send('Tu dois indiquer un type de sanction.');

        const t = args[1].toLowerCase();

        let type;
        let motif;

        if (!args[2]) return message.channel.send('Tu dois indiquer un motif !');

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

        connection.query(`INSERT INTO modlogs (modo, membre, motif, type, date) VALUES (?, ?, ?, ?, ?)`, [modo, membre, motif, type, time])

        let affType, affModo, affTime, affMembre

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

        affModo = client.users.resolve(modo);

        affMembre = client.users.resolve(membre);

        const date = new Date(time*1000);

        affTime = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

        client.channels.cache.get("724669164072993063").send('**['+affType+' - <@'+affModo.id+'>]** '+affTime+', <@'+affMembre.id+'> : '+motif)

        return message.channel.send(`Suivi correctement effectué.`);
}

exports.help = {
  name: 'suivi'
}
