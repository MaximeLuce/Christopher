const { Client, Collection, MessageEmbed } = require('discord.js')
const { readdir } = require('fs')
const { createConnection } = require('mysql2');
const cron = require('node-cron')
const weather = require('weather-js');
const config = require('./config.json');
const ephemeride = require('./assets/ephemeride.json');
const moment = require('moment');
const date = require('date');

const client = new Client({
  partials: ['MESSAGE', 'GUILD_MEMBER', 'USER'],
  ws: {
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
  }
})

client.commands = new Collection()

client.login(config.token);

const connection = createConnection({
  host: config.connexion.host,
  user: config.connexion.user,
  password: config.connexion.password,
  database: config.connexion.database
});

connection.connect(function(err){
  if(err) throw err;
  console.log("Connecté à la base de données.")
});

const quote = require('./assets/quote.json')

readdir('./events/', (err, files) => {
  if (err) throw err;

  for (const f of files.filter(f => f.endsWith('.js'))) {
    const event = require(`./events/${f}`)
    client.on(f.split('.')[0], event.bind(null, client))
    delete require.cache[require.resolve(`./events/${f}`)]
  }
  console.log(`[Events] Chargement de ${files.length} events`)
})

readdir('./commands/', (err, files) => {
  if (err) throw err;
  for (const command of files.filter(f => f.endsWith('.js'))) {
    const props = require(`./commands/${command}`)
    client.commands.set(props.help.name, props)
    console.log(`-> ${command} chargé`)
  }
})

cron.schedule('0 0 * * *', () => {
  const quoteRandom = quote[Math.floor(Math.random() * quote.length)]
  client.channels.cache.get('547864791855792139').send(`__**La citation du jour :**__ \n \n *${quoteRandom}*`);
  let time = Date.now();
  time = Math.round(time/1000);
  connection.query(`SELECT * FROM pub WHERE time < ?`, 
    [time],
    function(err, results){
      if(err) throw err;
      if(results[0]){
        results.forEach(e => {
          client.channels.cache.get('589924311557472332').permissionOverwrites.get(e['idm']).delete();
          connection.query(`DELETE FROM pub WHERE time < ?`, [time]);
        });
      }
    });
}, {
  timezone: "Europe/Paris"
})
cron.schedule('0 8 * * 6,0', () => {
  client.channels.cache.get('506450346697031710').send(`Bon week-end à tous ! :tada:`)
}, {
  timezone: "Europe/Paris"
})
cron.schedule('0 9 * * 4,0', () => {
  client.channels.cache.get('506450346697031710').send(`Pour soutenir le projet, n'hésitez pas à le suivre sur les différents réseaux sociaux et partager les événements :wink: Tous les liens se trouvent ici : https://le-max-de-culture.fr/link`)
}, {
  timezone: "Europe/Paris"
})
cron.schedule('0 6 * * 1', () => {
  client.channels.cache.get('506450346697031710').send(`Bonne semaine ! Bon courage à tous :muscle:`)
}, {
  timezone: "Europe/Paris"
})

cron.schedule(`* * * * *`, () => {
  const quoteRandom = quote[Math.floor(Math.random() * quote.length)]
  connection.query(`SELECT * FROM msg_auto WHERE timestamp > ? AND timestamp < ?`,
    [(Date.now()/1000)-30, (Date.now()/1000)+30],
    function(err, results) {
      if(err) throw err;
      if(results[0]){
        results.forEach(e => { 
          client.channels.cache.get(e['channel']).send(e['message']);
          connection.query(`DELETE FROM msg_auto WHERE timestamp = ?`, [e['timestamp']]);
        });
      }
    });
}, {
  timezone: "Europe/Paris"
})

cron.schedule('0 8 * * *', () => {
  connection.query(
    `SELECT * FROM birthdays WHERE date = ?`,
    [moment().format("DD/MM")],
    async function(err, results) {
      if (err) console.log(err)

      let anniv

      if(results.length === 1) {
        anniv = `Nous fêtons aujourd'hui l'anniversaire de <@${results[0].id}> !`
      } else if (results.length > 1) {
        anniv = `Nous fêtons aujourd'hui les anniversaires de <@${results.map(i => i.id).join('>, <@')}> !`
      } else if (!results[0]) {
        anniv = 'Aucun anniversaire aujourd\'hui !'
      }

      const date = new Date()

      const jour = {
        0: 'Dimanche',
        1: 'Lundi',
        2: 'Mardi',
        3: 'Mercredi',
        4: 'Jeudi',
        5: 'Vendredi',
        6: 'Samedi'
      }

      const mois = {
        0: "Janvier",
        1: "Février",
        2: "Mars",
        3: "Avril",
        4: "Mai",
        5: "Juin",
        6: "Juillet",
        7: "Août",
        8: "Septembre",
        9: "Octobre",
        10: "Novembre",
        11: "Décembre"
      }

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

      const villes = ['Paris', 'Lille', 'Strasbourg', 'Caen', 'Brest', 'Nantes', 'Limoges', 'Bordeaux', 'Toulouse', 'Perpignan', 'Montpellier', 'Nice', 'Clermont-Ferrand', 'Lyon', 'Dijon', 'Bourges']

      weather.find({search: villes[Math.floor(Math.random() * villes.length)], degreeType: 'C'}, function(err, result) {
        const current = result[0].current
       
      const bienvenue = new MessageEmbed()
        .setTitle(`:newspaper2: • Bonjour à tous !`)
        .setDescription(`Nous sommes le ${jour[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()} et nous fêtons aujourd'hui ${ephemeride[date.getDate()][date.getMonth() + 1]}.`)
        .addField('Anniversaire(s) :', anniv)
        .addField('Météo :', `Aujourd'hui à **${current.observationpoint}** : \n• Temps : ${temps[current.skytext]} \n• Température : ${current.temperature}°C (ressentie ${current.feelslike}°C) \n• Taux d'humidité : ${current.humidity}% \n• Vent : ${current.winddisplay.replace('North', 'Nord').replace('South', 'Sud').replace('East', 'Est').replace('West', 'Ouest').replace('east', '-Est').replace('west', '-Ouest')}`)
        .addField('Liens utiles :', '[Le Max De Culture](https://le-max-de-culture.fr/link) - [L\'équipe](https://le-max-de-culture.fr/fr/team/) - [La chaîne YouTube](https://www.youtube.com/channel/UCcUIG4QC68iMr6iEEXVd8MQ)')
        .setColor('#3867d6')
        .attachFiles(['assets/images/logo.png'])
        .setAuthor('Le Max de Culture', 'attachment://logo.png', 'https://le-max-de-culture.fr/')
        .setFooter('Nous vous souhaitons une agréable journée !')
        .setTimestamp()

        client.channels.cache.get('800813922872852494').send(bienvenue)
      });
    }
  );
}, {
  timezone: "Europe/Paris"
})
