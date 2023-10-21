const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
    name: 'serveur',
    aliases: ['server'],
    description: 'Utilisation : &serveur | Donne les informations relatives au serveur discord.',
    execute: async (_client, message) => {
        let date = message.guild.createdAt;
        let jour = ("0" + date.getDate()).slice(-2);
        let mois = ("0" + (date.getMonth() + 1)).slice(-2);
        let annee = date.getFullYear();
        let heure = ("0" + date.getHours()).slice(-2);
        let minute = ("0" + date.getMinutes()).slice(-2);
        let affTime = jour+'/'+mois+'/'+annee+' '+heure+':'+minute;
        const avatarEmbed = new EmbedBuilder()
            .setColor('#3867d6')
            .setTitle(':bulb: Informations sur le serveur :bulb:')
            .addFields({name: 'Nom du serveur', value: `${message.guild.name}`, inline: true},
                    {name: 'Nombre de membres', value: `${message.guild.memberCount}`, inline: true},
                    {name: 'Serveur créé le ', value: `${affTime}`, inline: true},
                    {name: 'Responsable ', value: `<@323218593275969548>`, inline: true})
            .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
        message.channel.send({embeds: [avatarEmbed], files: ['assets/images/logo.png']})
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
    }
}