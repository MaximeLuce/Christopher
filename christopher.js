const { Client, Intents, Collection, EmbedBuilder, GatewayIntentBits, Partials } = require('discord.js')
const fs = require('fs')
const { createConnection } = require('mysql2');
const cron = require('node-cron')
const weather = require('weather-js');
const config = require('./config.json');
const ephemeride = require('./assets/ephemeride.json');
const constantes = require('./assets/constantes.json');
const prefectures = require('./assets/prefectures.json');
const moment = require('moment');
const date = require('date');

let time = Date.now();
time = Math.round(time/1000);

const client = new Client({
  partials: [Partials.Message,
              Partials.GuildMember,
              Partials.User,
              Partials.Channel
            ],
  intents: [GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMembers, 
            GatewayIntentBits.GuildPresences, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.GuildMessageReactions, 
            GatewayIntentBits.GuildVoiceStates, 
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
          ]
  })

client.commands = new Collection();
client.aliases = new Collection();

client.login(config.token);

process.on('warning', (warning) => {
    console.log(warning.stack);
});

const connection = []

connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }))

connection[0].connect(function(err){
  if(err) throw err;
  console.log("Connecté à la base de données.")
});
connection[0].end()
connection.shift()

const quote = require('./assets/quote.json')


fs.readdir('./events/', (err, files) => {
    if (err)  throw err;

    for (const f of files.filter(f => f.endsWith('.js'))) {
        const event = require(`./events/${f}`);
        const eventName = f.split('.')[0];
        client.on(eventName, event.bind(null, client))
        delete require.cache[require.resolve(`./events/${f}`)]
        console.log(`-> ${f} chargé`)
    }
})

fs.readdir('./commands/', (err, files) => {
  if (err)  throw err;
  for (const command of files.filter(f => f.endsWith('.js'))) {
    const props = require(`./commands/${command}`)
    if(props.name){
      client.commands.set(props.name, props)
      console.log(`-> ${command} chargé`)
    } 

    if(props.aliases && Array.isArray(props.aliases)){
      props.aliases.forEach(alias => client.aliases.set(alias, props.name));
    }
  }
})

var insultes = [];

connection.push(createConnection({
  host: config.connexion.host,
  user: config.connexion.user,
  password: config.connexion.password,
  database: config.connexion.database
}))
connection[0].query(`SELECT * FROM commun_insultes`,
async function(err, results) {
  if (err)  throw err;
  if(results[0]){
    results.forEach(e => {
      insultes.push(e.mot);
    })
    global.insultes = insultes
  }
})

connection[0].end()
connection.shift()

cron.schedule('0 0 * * *', () => {
  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(`SELECT * FROM commun_citations WHERE supp = 1 ORDER BY RAND() LIMIT 1`,
    function(err, results){
      if(err)  throw err;
      if(results[0]){
        results.forEach(e => {
          var id = e.id;
          client.channels.cache.get(constantes["citation"]).send(`__**La citation du jour :**__ \n \n « ${e.citation} » — ${e.auteur}`);
          connection.push(createConnection({
            host: config.connexion.host,
            user: config.connexion.user,
            password: config.connexion.password,
            database: config.connexion.database
          }));
          connection[0].query(`UPDATE commun_citations SET nb_passages = nb_passages+1 WHERE id = ?`, 
            [id], 
            function(err, results){
                if(err) throw err;
            })
          connection[0].end()
          connection.shift()
        })
      }
    });
  connection[0].end()
  connection.shift()

  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(`SELECT * FROM chris_pub WHERE moment < ?`,
    [time],
    function(err, results){
      if(err) throw err;
      if(results[0]){
        results.forEach(e => {
          a = client.channels.cache.get(constantes["pub"]).permissionOverwrites.cache.get(e['idm'])
          if(a) a.delete();
          connection.push(createConnection({
            host: config.connexion.host,
            user: config.connexion.user,
            password: config.connexion.password,
            database: config.connexion.database
          }));
          connection[0].query(`DELETE FROM chris_pub WHERE moment < ?`, 
            [time], 
            function(err, results){
                if(err) throw err;
            })
          connection[0].end()
          connection.shift()
        });
      }
    });
  connection[0].end()
  connection.shift()

  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(`DELETE FROM chris_vocabulaire WHERE horaire < ?`, 
    [time-2592000], 
    function(err, results){
        if(err) throw err;
    })
  connection[0].end()
  connection.shift()
}, {
  timezone: "Europe/Paris"
});

cron.schedule('0 8 * * 6,0', () => {
  client.channels.cache.get(constantes["general"]).send(`Bon week-end à tous ! :tada:`)
}, {
  timezone: "Europe/Paris"
})

cron.schedule('0 9 * * 4,0', () => {
  client.channels.cache.get(constantes["general"]).send(`Pour soutenir le projet, n'hésitez pas à le suivre sur les différents réseaux sociaux et partager les événements :wink: Tous les liens se trouvent ici : https://le-max-de-culture.fr/liens`)
}, {
  timezone: "Europe/Paris"
})

cron.schedule('0 6 * * 1', () => {
  client.channels.cache.get(constantes["general"]).send(`Bonne semaine ! Bon courage à tous :muscle:`)
}, {
  timezone: "Europe/Paris"
})

cron.schedule(`* * * * *`, () => {
  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(`SELECT * FROM chris_msg_auto WHERE timestamp > ? AND timestamp < ?`,
    [(Date.now()/1000)-30, (Date.now()/1000)+30],
    function(err, results) {
      if(err) throw err;
      if(results[0]){
        results.forEach(e => {
          if(e['auteur'] == 0){
            const mute = client.users.cache.get(e['message']);
            mute.roles.remove('732136692085030912').then(member => {
              message.channel.send(`**${member.user.tag}** a été unmute par **Christopher**`)

              const unmute = new EmbedBuilder()
                .setColor('#3867d6')
                .setTitle("Unmute !")
                .addFields({name: 'User :', value: member.user.tag},
                          {name: 'Unmuted par :', value: 'Christopher'})
                .setTimestamp()

              client.channels.cache.get(constantes["logs_chris"]).send({embeds: [unmute]})
            });
          } else {
            client.channels.cache.get(e['salon']).send(e['message'])
          }

          connection.push(createConnection({
            host: config.connexion.host,
            user: config.connexion.user,
            password: config.connexion.password,
            database: config.connexion.database
          }));
          connection[0].query(`DELETE FROM chris_msg_auto WHERE timestamp = ?`, 
            [e['timestamp']], 
            function(err, results){
                if(err) throw err;
            })
          connection[0].end()
          connection.shift()
        });
      }
    });
  connection[0].end()
  connection.shift()

  let tomorrow = moment().tz('Europe/Paris').add(1, 'days').format("YYYY/MM/DD");
  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(`SELECT * FROM commun_stats WHERE date = ?`,
    [tomorrow],
    async function(err, results) {
      if (err)  throw err;
      if(!results[0]){
        connection.push(createConnection({
          host: config.connexion.host,
          user: config.connexion.user,
          password: config.connexion.password,
          database: config.connexion.database
        }));
        connection[0].query(`INSERT INTO commun_stats (date) VALUES (?)`, 
          [tomorrow], 
          function(err, results){
              if(err) throw err;
          })
        connection[0].end()
        connection.shift()
      }
  });
  connection[0].end()
  connection.shift()

  if(Math.floor(Math.random() * 20000) == 0){
    client.channels.cache.get(constantes["general"]).send("Savez-vous qu'il existe des salons cachés ? Trouvez comment y accéder !");
  }
}, {
  timezone: "Europe/Paris"
})


cron.schedule('0 6 * * *', () => {
  let yesterday = moment().tz('Europe/Paris').subtract(1, "days").format("YYYY/MM/DD");
  let yesterday2 = moment().tz('Europe/Paris').subtract(1, "days").format("DD/MM/YYYY");
  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(`SELECT * FROM commun_stats WHERE date = ?`,
    [yesterday],
    function(err, results){
      if(err) throw err;
      if(results[0]){
        results.forEach(e => {
          const nbMembres = client.guilds.cache.get(constantes["serveur"]).memberCount;
          const nvMembres = e['nouveaux_membres'];
          const lostMembres = e['membres_perdus'];
          const membres_actifs = JSON.parse(e['membres_actifs']);
          const nb_membres_actifs = Object.keys(membres_actifs).length;
          const salons_actifs = JSON.parse(e['salons_actifs']);
          const nb_salons_actifs = Object.keys(salons_actifs).length;
          let date_jour = moment().tz('Europe/Paris').subtract(1, "days").format("DD/MM/YYYY");

          let nb_messages = 0;
          for (var key in salons_actifs){
            nb_messages += salons_actifs[key];
          }

          let most_a_c = '';
          keysSorted = Object.keys(salons_actifs).sort(function(a,b){return salons_actifs[b]-salons_actifs[a]});
          max = (keysSorted.length > 5) ? 5 : keysSorted.length;
          for(var i = 0 ; i < max ; i++){
            most_a_c = most_a_c+'<#'+keysSorted[i]+'> : '+salons_actifs[keysSorted[i]]+' m.\n';
          }
          most_a_c = (most_a_c === '') ? 'Aucun message' : most_a_c;

          let stat = '';

          connection.push(createConnection({
              host: config.connexion.host,
              user: config.connexion.user,
              password: config.connexion.password,
              database: config.connexion.database
            }));
          connection[0].query(
              `SELECT * FROM commun_stats_quiz WHERE date = ?`,
              [yesterday2],
              async function(err, results) {
                if(err) throw err;
                if (!results[0]) {
                  stat = "Il n'y a eu aucune question répondue hier au quiz.";
                } else {
                  const total = Number(results[0].vrai) + Number(results[0].faux) + Number(results[0].hors_delai);
                  const vrai = Number(results[0].vrai);
                  stat = `Hier, il y a eu ${(vrai/total*100).toFixed(2)} % de bonnes réponses au quiz.`
                }

                const statistiques = new EmbedBuilder()
                  .setColor('#3867d6')
                  .setTitle(`<:lmdc:750836302823293010> Statistiques du ${date_jour} <:lmdc:750836302823293010>`)
                  .addFields(
                    {name: 'Nombre de membres', value: `${nbMembres}`, inline: true},
                    {name: 'Nouveaux membres', value: `${nvMembres}`, inline: true},
                    {name: 'Membres perdus', value: `${lostMembres}`, inline: true}
                  )
                  .addFields(
                    {name: 'Messages postés', value: `${nb_messages}`, inline: true},
                    {name: 'Membres actifs', value: `${nb_membres_actifs}`, inline: true},
                  )
                  .addFields(
                    {name: 'Salons actifs', value: `${nb_salons_actifs}`, inline: true},
                    {name: 'Salons les plus actifs', value: `${most_a_c}`, inline: true},
                    {name: 'Statistiques du quiz', value: `${stat}`, inline: true}
                  )
                  .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'});
                client.channels.cache.get(constantes["statistiques"]).send({embeds: [statistiques], files: ['assets/images/logo.png']})
              });
          connection[0].end()
          connection.shift()
        });
      }
    });
  connection[0].end()
  connection.shift()
  
  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(
    `SELECT * FROM chris_anniversaires WHERE date = ?`,
    [moment().tz('Europe/Paris').format("DD/MM")],
    async function(err, results) {
      if (err)  throw err;

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

      const ville = prefectures[Math.floor(Math.random() * prefectures.length)]

      // weather.find({search: ville, degreeType: 'C'}, function(err, result) {
        // if(err) throw err;
        const bienvenue = new EmbedBuilder()
          .setTitle(`:newspaper2: • Bonjour à tous !`)
          .setDescription(`Nous sommes le ${jour[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()} et nous fêtons aujourd'hui ${ephemeride[date.getDate()][date.getMonth() + 1]}.`)
          .addFields({name: 'Anniversaire(s) :', value: anniv},                  
                    {name: 'Liens utiles :', value: '[Le Max De Culture](https://le-max-de-culture.fr/link) - [L\'équipe](https://le-max-de-culture.fr/fr/team/) - [La chaîne YouTube](https://www.youtube.com/channel/UCcUIG4QC68iMr6iEEXVd8MQ)'})
          .setColor('#3867d6')
          .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
          .setFooter({text: 'Nous vous souhaitons une agréable journée !'})
          .setTimestamp()

        // if (!result || (Array.isArray(result) && result.length == 0)){
        //   console.log(ville)
        // } else {
        //   const current = result[0].current
        //   bienvenue.addField('Météo :', `Aujourd'hui à **${current.observationpoint}** : \n• Temps : ${temps[current.skytext]} \n• Température : ${current.temperature}°C (ressentie ${current.feelslike}°C) \n• Taux d'humidité : ${current.humidity}% \n• Vent : ${current.winddisplay.replace('North', 'Nord').replace('South', 'Sud').replace('East', 'Est').replace('West', 'Ouest').replace('east', '-Est').replace('west', '-Ouest')}`)
        // }

        client.channels.cache.get(constantes["general"]).send({embeds: [bienvenue], files: ['assets/images/logo.png']})
      // });
    });
  connection[0].end()
  connection.shift()
}, {
  timezone: "Europe/Paris"
})

// cron.schedule('1 6 * * *', () => { // CALENDRIER DE L'AVENT
//   connection.push(createConnection({
//     host: config.connexion.host,
//     user: config.connexion.user,
//     password: config.connexion.password,
//     database: config.connexion.database
//   }));
//   const aff_horaire = new Date();
//   let time2 = Date.now();
//   time2 = Math.round(time2/1000);
//   connection[0].query(`SELECT * FROM chris_avent WHERE jour = ?`,
//     [aff_horaire.getDate()],
//     function(err, results){
//       if(err) throw err;
//       if(results[0]){
//         client.channels.cache.get('1047540533616197662').send(results[0]['enigme']);
//         connection.push(createConnection({
//           host: config.connexion.host,
//           user: config.connexion.user,
//           password: config.connexion.password,
//           database: config.connexion.database
//         }));
//         connection[0].query(`UPDATE chris_avent SET timestamp = ? WHERE jour = ?`, 
//           [time2, aff_horaire.getDate()], 
//           function(err, results){
//             if(err) throw err;
//           })
//         connection[0].end()
//         connection.shift()
//         }
//       }
//     );
//   connection[0].end()
//   connection.shift()
//   }, {
//   timezone: "Europe/Paris"
// })
