const { EmbedBuilder } = require('discord.js')
const weather = require('weather-js');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';
const prefectures = require('../assets/prefectures.json');

module.exports = {
    name: 'weather',
    aliases: ['météo', 'meteo'],
    description: 'Utilisation : &météo ville | Affiche la météo correspondante à la ville donnée en paramètre.',
    execute: async (_client, message, args) => {

        if (!args[0]) {
            return message.channel.send("Veuillez entrer une localisation !")
        }
        else {
            weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
                if (!result || (Array.isArray(result) && result.length == 0)) {
                    return message.channel.send(`Je n'ai pas trouvé cette ville : ${args.join(' ')}`)
                } else {
                    const current = result[0].current;
                    const results = result[0]
                    const temps = {
                        "Sunny": "Le temps est ensoleillé.",
                        "Clear": "Le ciel est dégagé.",
                        "Mostly Sunny": "Le soleil est timide.",
                        "Cloudy": "Le ciel est nuageux.",
                        "Mostly Cloudy": "Quelques nuages sont présents.",
                        "Light Rain": "Une légère pluie tombe.",
                        "Partly Sunny": "Le soleil est discret.",
                        "T-Storm": "Une tempête fait rage.",
                        "Partly Cloudy": "Un nuage se balade.",
                        "Rain Showers": "La pluie tombe en averses.",
                        "Light Snow": "Une petite neige se dépose.",
                        "Mostly Clear": "Le ciel est plutôt dégagé.",
                        "Rain": "La pluie tombe.",
                        "Snow": "La neige tombe."
                    }

                    const weather_embed = new EmbedBuilder()
                        .setDescription(`**${current.observationpoint}**`)
                        .setTitle(`Météo de :`)
                        .setThumbnail(current.imageUrl)
                        .addFields({name: "__Météo actuelle__", value: temps[current.skytext]},
                                    {name: ':thermometer: Température', value: `${current.temperature} °C`, inline: true},
                                    {name: ':thermometer_face: Température ressentie', value: `${current.feelslike} °C`, inline: true},
                                    {name: ':dash: Vent', value: current.winddisplay, inline: true},
                                    {name: ':droplet: Humidité', value: `${current.humidity} %`, inline: true},
                                    {name: '\u200b', value: '\u200b'},
                                    {name: "__Prévisions à un jour__", value: temps[results.forecast[1].skytextday]},
                                    {name: ':thermometer: Température min', value: `${results.forecast[1].low} °C`, inline: true},
                                    {name: ':thermometer: Température max', value: `${results.forecast[1].high} °C`, inline: true},
                                    {name: ':sweat_drops: Chances de précipitations', value: `${results.forecast[1].precip} %`, inline: true})
                        .setTimestamp()
                        .setColor('#3867d6')
                        .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
                        message.channel.send({embeds: [weather_embed], files: ['assets/images/logo.png']})
                            .catch(function(err) {
                                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                                    if(err) throw err;
                                });
                            })
                }
            });   
        }

        
    }
}