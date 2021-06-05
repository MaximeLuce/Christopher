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
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if(message.mentions.users.size === 0) return message.channel.send("Tu dois mentionner un utilisateur !");
        
        const reason = args.slice(1).join(' ') || `Aucune raison spécifiée !`

        const mute = message.guild.member(message.mentions.users.first());

        if(!mute) return message.channel.send('Cet utilisateur n\'existe pas !')

        try{
            const embed = new MessageEmbed()
            .setColor('#3867d6')
            .setTitle("Mute !")
            .setDescription(`Vous avez été mute sur le Max de Culture`)
            .addField(`Raison : `, reason)
            .setFooter('Pour toute contestation, n\'hesitez pas à contacter un membre du staff')
            .setTimestamp()
            await mute.send(embed)
          } catch {
          }
        mute.roles.add('732136692085030912').then(member => {
            message.channel.send(`**${member.user.tag}** a été mute par **${message.author.tag}** pour **${reason}**`)
            
            client.channels.cache.get('745938396328755220').send(new MessageEmbed()
              .setColor('#3867d6')
              .setTitle("Mute !")
              .addField('User :', member.user.tag)
              .addField('Muted par :', message.author.tag)
              .addField('Raison :', reason)
              .setTimestamp())
            
            connection.query(`INSERT INTO modlogs (modo, membre, motif, type, date) VALUES (?, ?, ?, ?, ?)`, [message.author.id, member.user.id, reason, 2, Math.round(Date.now()/1000)])
        });

    }
    
exports.help = {
    name: "mute"
}
