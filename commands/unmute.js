const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Que voulais-tu faire ? Il n'y a rien à voir ici !")

        if(message.mentions.users.size === 0) return message.channel.send("Tu dois mentionner un utilisateur !");
        
        const mute = message.guild.member(message.mentions.users.first());

        if(!mute) return message.channel.send('Cet utilisateur n\'existe pas !')

        try{
            mute.send("Vous avez été unmute sur le Max de Culture");
          } catch {
          }
        mute.roles.remove('732136692085030912').then(member => {
            message.channel.send(`**${member.user.tag}** a été unmute par **${message.author.tag}**`)
            
            client.channels.cache.get('835593178064486470').send(new MessageEmbed()
              .setColor('#3867d6')
              .setTitle("Unmute !")
              .addField('User :', member.user.tag)
              .addField('Unmuted par :', message.author.tag)
              .setTimestamp())
        });

    }
    
exports.help = {
    name: "unmute"
}
