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

        if(message.mentions.users.size === 0) return message.channel.send("Tu dois mentionner un utilisateur !")
        
        const reason = args.slice(1).join(' ') || `Aucune raison spécifié !`

        const ban = message.guild.member(message.mentions.users.first())

        if(!ban) return message.channel.send('Cet utilisateur n\'existe pas !')

        if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.channel.send("Je n'ai pas la permission pour ban !");
        }

        if(!ban.bannable) {
            return message.channel.send("Ban impossible !");
        }

        try{
            const embed = new MessageEmbed()
            .setColor('#3867d6')
            .setTitle("BAN !")
            .setDescription(`Vous avez été banni du Max de Culture`)
            .addField(`Raison :`, reason)
            .setFooter('Pour toute contestation, n\'hesitez pas à contacter un membre du staff')
            .setTimestamp()
            await ban.send(embed)
          } catch {
          }
        ban.ban({ reason: reason }).then(member => {
            message.channel.send(`**${member.user.tag}** a été banni par **${message.author.tag}** pour **${reason}**`)

            client.channels.cache.get('745938396328755220').send(new MessageEmbed()
              .setColor('#3867d6')
              .setTitle("BAN !")
              .addField('User :', member.user.tag)
              .addField('Banni par :', message.author.tag)
              .addField('Raison :', reason)
              .setTimestamp())
        });

        connection.query(`INSERT INTO modlogs (modo, membre, motif, type, date) VALUES (?, ?, ?, ?, ?)`, [message.author.id, ban.user.id, reason, 4, Math.round(Date.now()/1000)])
    }
    
exports.help = {
    name: "ban"
}
