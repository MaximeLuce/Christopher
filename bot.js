const { Client, Collection, MessageEmbed } = require('discord.js')
const { readdir } = require('fs')
const { createConnection } = require('mysql2');
const cron = require('node-cron')
const weather = require('weather-js');
const config = require('./config.json')
const moment = require('moment');

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
const quote = require('./assets/quote.json')

readdir('./events/', (err, files) => {
  if (err) console.log(err)

  for (const f of files.filter(f => f.endsWith('.js'))) {
    const event = require(`./events/${f}`)
    client.on(f.split('.')[0], event.bind(null, client))
    delete require.cache[require.resolve(`./events/${f}`)]
  }
  console.log(`[Event] Chargement de ${files.length} events`)
})

readdir('./commands/', (err, files) => {
  if (err) console.log(err)
  for (const command of files.filter(f => f.endsWith('.js'))) {
    const props = require(`./commands/${command}`)
    client.commands.set(props.help.name, props)
    console.log(`${command} chargé`)
  }
})

cron.schedule('0 0 * * *', () => {
  const quoteRandom = quote[Math.floor(Math.random() * quote.length)]
  client.channels.cache.get('547864791855792139').send(`__**La citation du jour :**__ \n \n *${quoteRandom}*`)
}, {
  timezone: "Europe/Paris"
})
cron.schedule('0 8 * * 6,0', () => {
  client.channels.cache.get('506450346697031710').send(`Bon week-end à tous ! :tada:`)
}, {
  timezone: "Europe/Paris"
})
cron.schedule('0 9 * * 6,0', () => {
  client.channels.cache.get('506450346697031710').send(`Pour soutenir le projet, n'hésitez pas à le suivre sur les différents réseaux sociaux et partager les événements :wink: Tous les liens se trouvent ici : https://le-max-de-culture.fr/link`)
}, {
  timezone: "Europe/Paris"
})
cron.schedule('0 6 * * 1', () => {
  client.channels.cache.get('506450346697031710').send(`Bonne semaine ! Bon courage à tous :muscle:`)
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

        client.channels.cache.get('506450346697031710').send(bienvenue)
      });
    }
  );
}, {
  timezone: "Europe/Paris"
})


// A ignorer : fêtes du cenlendrier
const ephemeride = []
const nbJours = 31;
for (i=1;i<=nbJours;i++)
  ephemeride[i] = []
  
  ephemeride[1][1] = 'le Jour de l\'an';
  ephemeride[1][2] = 'les Ella';
  ephemeride[1][3] = 'les Aubin';
  ephemeride[1][4] = 'les Hugues';
  ephemeride[1][5] = 'les Jeremie';
  ephemeride[1][6] = 'les Justin';
  ephemeride[1][7] = 'les Thierry';
  ephemeride[1][8] = 'les Alphonse';
  ephemeride[1][9] = 'les Gilles';
  ephemeride[1][10] = 'les Thérèse';
  ephemeride[1][11] = 'la Toussaint';
  ephemeride[1][12] = 'les Florence';
  ephemeride[2][1] = 'les Basile';
  ephemeride[2][2] = 'les Théophane';
  ephemeride[2][3] = 'les Jaouen';
  ephemeride[2][4] = 'les Sandrine';
  ephemeride[2][5] = 'les Boris';
  ephemeride[2][6] = 'les Blandine';
  ephemeride[2][7] = 'les Martinien';
  ephemeride[2][8] = 'les Julien';
  ephemeride[2][9] = 'les Ingrid';
  ephemeride[2][10] = 'les Léger';
  ephemeride[2][11] = 'les Défunts';
  ephemeride[2][12] = 'les Viviane';
  ephemeride[3][1] = 'les Geneviève';
  ephemeride[3][2] = 'les Blaise';
  ephemeride[3][3] = 'les Gwénola';
  ephemeride[3][4] = 'les Richard';
  ephemeride[3][5] = 'les Philippe';
  ephemeride[3][6] = 'les Kevin';
  ephemeride[3][7] = 'les Thomas';
  ephemeride[3][8] = 'les Lydie';
  ephemeride[3][9] = 'les Grégoire';
  ephemeride[3][10] = 'les Gérard';
  ephemeride[3][11] = 'les Hubert';
  ephemeride[3][12] = 'les Xavier';
  ephemeride[4][1] = 'les Odilon';
  ephemeride[4][2] = 'les Véronique';
  ephemeride[4][3] = 'les Casimir';
  ephemeride[4][4] = 'les Isidore';
  ephemeride[4][5] = 'les Sylvain';
  ephemeride[4][6] = 'les Clotilde';
  ephemeride[4][7] = 'les Florent';
  ephemeride[4][8] = 'les Jean-Marie';
  ephemeride[4][9] = 'les Rosalie';
  ephemeride[4][10] = 'les François';
  ephemeride[4][11] = 'les Charles';
  ephemeride[4][12] = 'les Barbara';
  ephemeride[5][1] = 'les Edouard';
  ephemeride[5][2] = 'les Agathe';
  ephemeride[5][3] = 'les Olive';
  ephemeride[5][4] = 'les Irène';
  ephemeride[5][5] = 'les Judith';
  ephemeride[5][6] = 'les Igor';
  ephemeride[5][7] = 'les Antoine';
  ephemeride[5][8] = 'les Abel';
  ephemeride[5][9] = 'les Raïssa';
  ephemeride[5][10] = 'les Fleur';
  ephemeride[5][11] = 'les Sylvie';
  ephemeride[5][12] = 'les Gérald';
  ephemeride[6][1] = 'les Mélaine';
  ephemeride[6][2] = 'les Gaston';
  ephemeride[6][3] = 'les Colette';
  ephemeride[6][4] = 'les Marcellin';
  ephemeride[6][5] = 'les Prudence';
  ephemeride[6][6] = 'les Norbert';
  ephemeride[6][7] = 'les Mariette';
  ephemeride[6][8] = 'les Octavien';
  ephemeride[6][9] = 'les Bertrand';
  ephemeride[6][10] = 'les Bruno';
  ephemeride[6][11] = 'les Bertille';
  ephemeride[6][12] = 'les Nicolas';
  ephemeride[7][1] = 'les Raymond';
  ephemeride[7][2] = 'les Eugénie';
  ephemeride[7][3] = 'les Félicité';
  ephemeride[7][4] = 'les Jean-Baptiles';
  ephemeride[7][5] = 'les Gisèle';
  ephemeride[7][6] = 'les Gilbert';
  ephemeride[7][7] = 'les Eliane';
  ephemeride[7][8] = 'les Gaétan';
  ephemeride[7][9] = 'les Reine';
  ephemeride[7][10] = 'les Serge';
  ephemeride[7][11] = 'les Carine';
  ephemeride[7][12] = 'les Ambroise';
  ephemeride[8][1] = 'les Lucien';
  ephemeride[8][2] = 'les Jacqueline';
  ephemeride[8][3] = 'les Jean de Dieu';
  ephemeride[8][4] = 'les Julie';
  ephemeride[8][5] = 'les Désiré';
  ephemeride[8][6] = 'les Médard';
  ephemeride[8][7] = 'les Thibaud';
  ephemeride[8][8] = 'les Dominique';
  ephemeride[8][9] = 'les Adrien';
  ephemeride[8][10] = 'les Pélagie';
  ephemeride[8][11] = 'les Geoffroy';
  ephemeride[8][12] = 'les Frida';
  ephemeride[9][1] = 'les Alix';
  ephemeride[9][2] = 'les Apolline';
  ephemeride[9][3] = 'les Françoise';
  ephemeride[9][4] = 'les Gautier';
  ephemeride[9][5] = 'les Pacôme';
  ephemeride[9][6] = 'les Diane';
  ephemeride[9][7] = 'les Amandine';
  ephemeride[9][8] = 'les Amour';
  ephemeride[9][9] = 'les Alain';
  ephemeride[9][10] = 'les Denis';
  ephemeride[9][11] = 'les Théodore';
  ephemeride[9][12] = 'les Pierre Fourier';
  ephemeride[10][1] = 'les Guillaume';
  ephemeride[10][2] = 'les Arnaud';
  ephemeride[10][3] = 'les Vivien';
  ephemeride[10][4] = 'les Fulbert';
  ephemeride[10][5] = 'les Solange';
  ephemeride[10][6] = 'les Trinité';
  ephemeride[10][7] = 'les Ulric';
  ephemeride[10][8] = 'les Laurent';
  ephemeride[10][9] = 'les Inès';
  ephemeride[10][10] = 'les Ghislain';
  ephemeride[10][11] = 'les Léon';
  ephemeride[10][12] = 'les Romaric';
  ephemeride[11][1] = 'les Paulin';
  ephemeride[11][2] = 'ND de Lourdes';
  ephemeride[11][3] = 'les Rosine';
  ephemeride[11][4] = 'les Stanislas';
  ephemeride[11][5] = 'les Eleslle';
  ephemeride[11][6] = 'les Barnabé';
  ephemeride[11][7] = 'les Benoît';
  ephemeride[11][8] = 'les Claire';
  ephemeride[11][9] = 'les Adelphe';
  ephemeride[11][10] = 'les Firmin';
  ephemeride[11][11] = 'les Martin';
  ephemeride[11][12] = 'les Daniel';
  ephemeride[12][1] = 'les Tatiana';
  ephemeride[12][2] = 'les Félix';
  ephemeride[12][3] = 'les Justine';
  ephemeride[12][4] = 'les Jules';
  ephemeride[12][5] = 'les Achille';
  ephemeride[12][6] = 'les Guy';
  ephemeride[12][7] = 'les Olivier';
  ephemeride[12][8] = 'les Clarisse';
  ephemeride[12][9] = 'les Apollinaire';
  ephemeride[12][10] = 'les Wilfrid';
  ephemeride[12][11] = 'les Christian';
  ephemeride[12][12] = 'les Chantal';
  ephemeride[13][1] = 'les Yvette';
  ephemeride[13][2] = 'les Béatrice';
  ephemeride[13][3] = 'les Rodrigue';
  ephemeride[13][4] = 'les Ida';
  ephemeride[13][5] = 'les Rolande';
  ephemeride[13][6] = 'les Antoine';
  ephemeride[13][7] = 'les Henri et les Joël';
  ephemeride[13][8] = 'les Hippolyte';
  ephemeride[13][9] = 'les Aimé';
  ephemeride[13][10] = 'les Géraud';
  ephemeride[13][11] = 'les Brice';
  ephemeride[13][12] = 'les Lucie';
  ephemeride[14][1] = 'les Nina';
  ephemeride[14][2] = 'les Valentin';
  ephemeride[14][3] = 'les Mathilde';
  ephemeride[14][4] = 'les Maxime';
  ephemeride[14][5] = 'les Matthias';
  ephemeride[14][6] = 'les Elisée';
  ephemeride[14][7] = 'les Camille et la Fête Nationale';
  ephemeride[14][8] = 'les Evrard';
  ephemeride[14][9] = 'les Materne';
  ephemeride[14][10] = 'les Jules';
  ephemeride[14][11] = 'les Sidoine';
  ephemeride[14][12] = 'les Odile';
  ephemeride[15][1] = 'les Rémi';
  ephemeride[15][2] = 'les Claude';
  ephemeride[15][3] = 'les Louise';
  ephemeride[15][4] = 'les Paterne';
  ephemeride[15][5] = 'les Denise';
  ephemeride[15][6] = 'les Germaine';
  ephemeride[15][7] = 'les Donald';
  ephemeride[15][8] = 'les Marie et l\'Assomption';
  ephemeride[15][9] = 'les Roland';
  ephemeride[15][10] = 'les Thérèse';
  ephemeride[15][11] = 'les Albert';
  ephemeride[15][12] = 'les Ninon';
  ephemeride[16][1] = 'les Marcel';
  ephemeride[16][2] = 'les Julienne';
  ephemeride[16][3] = 'les Bénédicte';
  ephemeride[16][4] = 'les Benoît-Joseph';
  ephemeride[16][5] = 'les Honoré';
  ephemeride[16][6] = 'les Régis';
  ephemeride[16][7] = 'les Carmen';
  ephemeride[16][8] = 'les Armel';
  ephemeride[16][9] = 'les Edith';
  ephemeride[16][10] = 'les Edwige';
  ephemeride[16][11] = 'les Marguerite';
  ephemeride[16][12] = 'les Alice';
  ephemeride[17][1] = 'les Roseline';
  ephemeride[17][2] = 'les Alexis';
  ephemeride[17][3] = 'les Patrick';
  ephemeride[17][4] = 'les Anicet';
  ephemeride[17][5] = 'les Pascal';
  ephemeride[17][6] = 'les Hervé';
  ephemeride[17][7] = 'les Charlotte';
  ephemeride[17][8] = 'les Hyacinthe';
  ephemeride[17][9] = 'les Renaud';
  ephemeride[17][10] = 'les Baudouin';
  ephemeride[17][11] = 'les Elisabeth';
  ephemeride[17][12] = 'les Gaël';
  ephemeride[18][1] = 'les Prisca';
  ephemeride[18][2] = 'les Bernadette';
  ephemeride[18][3] = 'les Cyrille';
  ephemeride[18][4] = 'les Parfait';
  ephemeride[18][5] = 'les Eric';
  ephemeride[18][6] = 'les Léonce';
  ephemeride[18][7] = 'les Frédéric';
  ephemeride[18][8] = 'les Hélène';
  ephemeride[18][9] = 'les Nadège';
  ephemeride[18][10] = 'les Luc';
  ephemeride[18][11] = 'les Aude';
  ephemeride[18][12] = 'les Gatien';
  ephemeride[19][1] = 'les Marius';
  ephemeride[19][2] = 'les Gabin';
  ephemeride[19][3] = 'les Joseph';
  ephemeride[19][4] = 'les Emma';
  ephemeride[19][5] = 'les Yves';
  ephemeride[19][6] = 'les Romuald';
  ephemeride[19][7] = 'les Arsène';
  ephemeride[19][8] = 'les Jean-Eudes';
  ephemeride[19][9] = 'les Emilie';
  ephemeride[19][10] = 'les René Goupil';
  ephemeride[19][11] = 'les Tanguy';
  ephemeride[19][12] = 'les Urbain';
  ephemeride[20][1] = 'les Sébastien';
  ephemeride[20][2] = 'les Aimée';
  ephemeride[20][3] = 'les Herbert';
  ephemeride[20][4] = 'les Odette';
  ephemeride[20][5] = 'les Bernardin';
  ephemeride[20][6] = 'les Silvère';
  ephemeride[20][7] = 'les Marina';
  ephemeride[20][8] = 'les Bernard';
  ephemeride[20][9] = 'les Davy';
  ephemeride[20][10] = 'les Adeline';
  ephemeride[20][11] = 'les Edmond';
  ephemeride[20][12] = 'les Théophile';
  ephemeride[21][1] = 'les Agnès';
  ephemeride[21][2] = 'les Damien';
  ephemeride[21][3] = 'les Clémence';
  ephemeride[21][4] = 'les Anselme';
  ephemeride[21][5] = 'les Constantin';
  ephemeride[21][6] = 'les Rodolphe';
  ephemeride[21][7] = 'les Victor';
  ephemeride[21][8] = 'les Christophe';
  ephemeride[21][9] = 'les Matthieu';
  ephemeride[21][10] = 'les Céline';
  ephemeride[21][11] = 'la Présentation de Marie';
  ephemeride[21][12] = 'les Pierre Canisius';
  ephemeride[22][1] = 'les Vincent';
  ephemeride[22][2] = 'les Isabelle';
  ephemeride[22][3] = 'les Léa';
  ephemeride[22][4] = 'les Alexandre';
  ephemeride[22][5] = 'les Emile';
  ephemeride[22][6] = 'les Alban';
  ephemeride[22][7] = 'les Marie-Madeleine';
  ephemeride[22][8] = 'les Fabrice';
  ephemeride[22][9] = 'les Maurice';
  ephemeride[22][10] = 'les Elodie';
  ephemeride[22][11] = 'les Cécile';
  ephemeride[22][12] = 'les Françoise-Xavière';
  ephemeride[23][1] = 'les Barnard';
  ephemeride[23][2] = 'les Lazare';
  ephemeride[23][3] = 'les Victorien';
  ephemeride[23][4] = 'les Georges';
  ephemeride[23][5] = 'les Didier';
  ephemeride[23][6] = 'les Audrey';
  ephemeride[23][7] = 'les Brigitte';
  ephemeride[23][8] = 'les Rose';
  ephemeride[23][9] = 'les Constant';
  ephemeride[23][10] = 'les Jean de Capistran';
  ephemeride[23][11] = 'les Clément';
  ephemeride[23][12] = 'les Armand';
  ephemeride[24][1] = 'les François de Sales';
  ephemeride[24][2] = 'les Modeles';
  ephemeride[24][3] = 'les Karine';
  ephemeride[24][4] = 'les Fidèle';
  ephemeride[24][5] = 'les Donatien';
  ephemeride[24][6] = 'les Yann';
  ephemeride[24][7] = 'les Christine';
  ephemeride[24][8] = 'les Barthélémy';
  ephemeride[24][9] = 'les Thècle';
  ephemeride[24][10] = 'les Florentin';
  ephemeride[24][11] = 'les Flora';
  ephemeride[24][12] = 'les Adèle';
  ephemeride[25][1] = 'les Apollos';
  ephemeride[25][2] = 'les Roméo';
  ephemeride[25][3] = 'l\'Annonciation';
  ephemeride[25][4] = 'les Marc';
  ephemeride[25][5] = 'les Sophie';
  ephemeride[25][6] = 'les Prosper';
  ephemeride[25][7] = 'les Jacques';
  ephemeride[25][8] = 'les Louis';
  ephemeride[25][9] = 'les Hermann';
  ephemeride[25][10] = 'les Crépin';
  ephemeride[25][11] = 'les Catherine';
  ephemeride[25][12] = 'Noël :gift:';
  ephemeride[26][1] = 'les Paule';
  ephemeride[26][2] = 'les Nestor';
  ephemeride[26][3] = 'les Lara';
  ephemeride[26][4] = 'les Alida';
  ephemeride[26][5] = 'les Bérenger';
  ephemeride[26][6] = 'les Anthelme';
  ephemeride[26][7] = 'les Anne';
  ephemeride[26][8] = 'les Natacha';
  ephemeride[26][9] = 'les Côme et les Damien';
  ephemeride[26][10] = 'les Dimitri';
  ephemeride[26][11] = 'les Delphine';
  ephemeride[26][12] = 'les Etienne';
  ephemeride[27][1] = 'les Angèle';
  ephemeride[27][2] = 'les Honorine';
  ephemeride[27][3] = 'les Habib';
  ephemeride[27][4] = 'les Zita';
  ephemeride[27][5] = 'les Augustin';
  ephemeride[27][6] = 'les Fernand';
  ephemeride[27][7] = 'les Nathalie';
  ephemeride[27][8] = 'les Monique';
  ephemeride[27][9] = 'les Vincent de Paul';
  ephemeride[27][10] = 'les Emeline';
  ephemeride[27][11] = 'les Séverin';
  ephemeride[27][12] = 'les Jean';
  ephemeride[28][1] = 'les Thomas d\'Aquin';
  ephemeride[28][2] = 'les Romain';
  ephemeride[28][3] = 'les Gontran';
  ephemeride[28][4] = 'les Valérie';
  ephemeride[28][5] = 'les Germain';
  ephemeride[28][6] = 'les Irénée';
  ephemeride[28][7] = 'les Samson';
  ephemeride[28][8] = 'les Augustin';
  ephemeride[28][9] = 'les Venceslas';
  ephemeride[28][10] = 'les Simon';
  ephemeride[28][11] = 'les Jacques de la Marche';
  ephemeride[28][12] = 'les Gaspard';
  ephemeride[29][1] = 'les Gildas';
  ephemeride[29][2] = 'les Augules';
  ephemeride[29][3] = 'les Gwladys';
  ephemeride[29][4] = 'les Catherine';
  ephemeride[29][5] = 'les Aymard';
  ephemeride[29][6] = 'les Pierre et les Paul';
  ephemeride[29][7] = 'les Marthe';
  ephemeride[29][8] = 'les Sabine';
  ephemeride[29][9] = 'Sts Michel';
  ephemeride[29][10] = 'les Narcisse';
  ephemeride[29][11] = 'les Saturnin';
  ephemeride[29][12] = 'les David';
  ephemeride[30][1] = 'les Martine';
  ephemeride[30][3] = 'les Amédée';
  ephemeride[30][4] = 'les Robert';
  ephemeride[30][5] = 'les Ferdinand';
  ephemeride[30][6] = 'les Martial';
  ephemeride[30][7] = 'les Juliette';
  ephemeride[30][8] = 'les Fiacre';
  ephemeride[30][9] = 'les Jérôme';
  ephemeride[30][10] = 'les Bienvenue';
  ephemeride[30][11] = 'les André';
  ephemeride[30][12] = 'les Roger';
  ephemeride[31][1] = 'les Marcelle';
  ephemeride[31][3] = 'les Benjamin';
  ephemeride[31][5] = 'les Perrette';
  ephemeride[31][7] = 'les Ignace';
  ephemeride[31][8] = 'les Aristide';
  ephemeride[31][10] = 'les Quentin';
  ephemeride[31][12] = 'les Sylvestre';
