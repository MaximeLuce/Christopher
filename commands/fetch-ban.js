const { MessageEmbed } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');

const connection = createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  });

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if(!args[0]) return message.channel.send("Tu dois m'indiquer un ID !")
        
        const reason = args.slice(1).join(' ') || `Aucune raison spécifiée !`

        if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.channel.send("Je n'ai pas la permission pour ban !");
        }

        try {
            const ban = await client.users.fetch(args[0])

            message.guild.members.ban(ban.id, { reason: reason }).then(user => {
                message.channel.send(`**${user.tag}** a été banni par **${message.author.tag}** pour **${reason}**`)

                const date = new Date(time*1000);
                affTime = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

                client.channels.cache.get("724669164072993063").send('**[Fetch-ban - <@'+message.author.id+'>]** '+affTime+', <@'+member.user.id+'> : '+reason);
    
                client.channels.cache.get('745938396328755220').send(new MessageEmbed()
                  .setColor('#3867d6')
                  .setTitle("BAN !")
                  .addField('User :', user.tag)
                  .addField('Banni par :', message.author.tag)
                  .addField('Raison :', reason)
                  .setTimestamp())
            });

            connection.query(`INSERT INTO modlogs (modo, membre, motif, type, date) VALUES (?, ?, ?, ?, ?)`, [message.author.id, ban.user.id, reason, 4, Math.round(Date.now()/1000)])
        } catch {
            return message.channel.send('Cet utilisateur n\'existe pas !')
        }

    }
    
exports.help = {
    name: "fetch-ban"
}
