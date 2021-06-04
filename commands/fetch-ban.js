const { MessageEmbed } = require("discord.js");
const { perms } = require('../config.json')

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if(!args[0]) return message.channel.send("Tu dois m'indiquer un ID !")
        
        const reason = args.slice(1).join(' ') || `Aucune raison spécifié !`

        try {
            const ban = await client.users.fetch(args[0])

            message.guild.members.ban(ban.id, { reason: reason }).then(user => {
                message.channel.send(`**${user.tag}** a été banni par **${message.author.tag}** pour **${reason}**`)
    
                client.channels.cache.get('745938396328755220').send(new MessageEmbed()
                  .setColor('#3867d6')
                  .setTitle("BAN !")
                  .addField('User :', user.tag)
                  .addField('Banni par :', message.author.tag)
                  .addField('Raison :', reason)
                  .setTimestamp())
            });
        } catch {
            return message.channel.send('Cet utilisateur n\'existe pas !')
        }
    }
    
exports.help = {
    name: "fetch-ban"
}
