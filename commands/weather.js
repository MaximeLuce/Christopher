const { MessageEmbed } = require('discord.js')
const weather = require('weather-js');

exports.run = async (_client, message, args) => {

    if (!args) {
        message.channel.send("Veuillez rentrer une localisation !")
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
            "Sunny": "Soleil",
            "Clear": "Dégagé",
            "Mostly Sunny": "Assez ensoleillé",
            "Cloudy": "Nuageux",
            "Mostly Cloudy": "Plutôt nuageux",
            "Light Rain": "Pluie légère",
            "Partly Sunny": "Partiellement ensoleillé",
            "T-Storm": "Tempêtes",
            "Partly Cloudy": "Partiellement nuageux",
            "Rain Showers": "Averses de pluie",
            "Light Snow": "Neige légère",
            "Mostly Clear": "Plutôt dégagé",
            "Rain": "Pluie",
            "Snow": "Neige"
        }


        const weather_embed = new MessageEmbed()
            .setDescription(`**${current.observationpoint}**`)
            .setTitle(`Météo de :`)
            .setThumbnail(current.imageUrl)
            .addField("`Météo actuelle`", temps[current.skytext])
            .addField(':thermometer: Température',`${current.temperature} °C`, true)
            .addField(':thermometer_face: Température ressentie', `${current.feelslike} °C`, true)
            .addField(':dash: Vent',current.winddisplay, true)
            .addField(':droplet: Humidité', `${current.humidity}%`, true)
            .addField('\u200b', '\u200b')
            .addField("`Prévisions à un jour`", temps[results.forecast[1].skytextday])
            .addField(':thermometer: Température max',`${results.forecast[1].high} °C`, true)
            .addField(':thermometer: Température min',`${results.forecast[1].low} °C`, true)
            .addField(':sweat_drops: Chance de précipitation',`${results.forecast[1].precip} %`, true)
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