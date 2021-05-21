const { MessageEmbed } = require('discord.js')
const weather = require('weather-js');

exports.run = async (_client, message, args) => {

    if (!args[0]) {
        message.channel.send("Veuillez entrer une localisation !")
      return;
      }

    weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {


        if (!result) {
            message.channel.send("Je n'ai pas trouvé cette ville")
            return;
        }

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


        const weather_embed = new MessageEmbed()
            .setDescription(`**${current.observationpoint}**`)
            .setTitle(`Météo de :`)
            .setThumbnail(current.imageUrl)
            .addField("__Météo actuelle__", temps[current.skytext])
            .addField(':thermometer: Température',`${current.temperature} °C`, true)
            .addField(':thermometer_face: Température ressentie', `${current.feelslike} °C`, true)
            .addField(':dash: Vent',current.winddisplay, true)
            .addField(':droplet: Humidité', `${current.humidity} %`, true)
            .addField('\u200b', '\u200b')
            .addField("__Prévisions à un jour__", temps[results.forecast[1].skytextday])
            .addField(':thermometer: Température min',`${results.forecast[1].low} °C`, true)
            .addField(':thermometer: Température max',`${results.forecast[1].high} °C`, true)
            .addField(':sweat_drops: Chances de précipitations',`${results.forecast[1].precip} %`, true)
            .setTimestamp()
            .setColor('#3867d6')
            .attachFiles(['assets/images/logo.png'])
            .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
            message.channel.send(weather_embed);
    });
    
}

exports.help = {
  name: 'meteo'
}