const { MessageEmbed } = require('discord.js')

exports.run = async (_client, message) => {
    let region = message.guild.region[0].toUpperCase()+message.guild.region.slice(1);
    let date = message.guild.createdAt;
    let jour = ("0" + date.getDate()).slice(-2);
    let mois = ("0" + (date.getMonth() + 1)).slice(-2);
    let annee = date.getFullYear();
    let heure = ("0" + date.getHours()).slice(-2);
    let minute = ("0" + date.getMinutes()).slice(-2);
    let affTime = jour+'/'+mois+'/'+annee+' '+heure+':'+minute;
    const avatarEmbed = new MessageEmbed()
        .setColor('#3867d6')
        .setTitle(':bulb: Informations sur le serveur :bulb:')
        .addField('Nom du serveur', `${message.guild.name}`, true)
        .addField('Nombre de membres', `${message.guild.memberCount}`, true)
        .addField('Serveur créé le ', `${affTime}`, true)
        .addField('Région ', `${region}`, true)
        .addField('Fondateur ', `${message.guild.owner}`, true)
        .attachFiles(['assets/images/logo.png'])
        .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
    message.channel.send(avatarEmbed);
}

exports.help = {
  name: 'serveur'
}
