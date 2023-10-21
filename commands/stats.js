const { EmbedBuilder } = require("discord.js");
const { createConnection } = require('mysql2');
const config = require('../config.json');
const constantes = require('../assets/constantes.json');
const moment = require('moment');
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'statistiques',
  aliases: ['stats'],
  description: 'Utilisation : &stats [date] | Sans paramètre donne les statistiques globales du serveur, avec une date au format JJ/MM/AAAA celles du jour en question.',
  execute: async (client, message, args) => {
    const connection = []
    if(!args[0]){
      const nbMembres = client.guilds.cache.get(constantes["serveur"]).memberCount;
      var nvMembres = 0;
      var lostMembres = 0;
      var salons_actifs = {};
      var membres_actifs = {};

      connection.push(createConnection({
        host: config.connexion.host,
        user: config.connexion.user,
        password: config.connexion.password,
        database: config.connexion.database
      }));
      connection[0].query(`SELECT * FROM commun_stats`,
        function(err, results){
          if(err) {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
            });
          };
          if(results[0]){
            results.forEach(e => {
              nvMembres += e['nouveaux_membres'];
              lostMembres += e['membres_perdus'];
              const a_m = JSON.parse(e['membres_actifs']);
              for(const [key, value] of Object.entries(a_m)){
                if(key in membres_actifs){
                  membres_actifs[key] = membres_actifs[key]+value;
                } else {
                  membres_actifs[key] = value;
                }
              }

              const a_c = JSON.parse(e['salons_actifs']);
              for(const [key, value] of Object.entries(a_c)){
                if(key in salons_actifs){
                  salons_actifs[key] = salons_actifs[key]+value;
                } else {
                  salons_actifs[key] = value;
                }
              }
            });

            let nb_messages = 0;
            for (var key in salons_actifs){
              nb_messages += salons_actifs[key];
            }

            const nb_membres_actifs = Object.keys(membres_actifs).length;
            const nb_salons_actifs = Object.keys(salons_actifs).length;

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
              `SELECT *, SUM(vrai) AS vrai_total, SUM(faux) AS faux_total, SUM(hors_delai) AS hors_delai_total FROM commun_stats_quiz`,
              async function(err, results) {
                if(err) throw err;
                if (!results[0]) {
                  stat = "Il n'y a eu aucune question au quiz.";
                } else {
                  const total = Number(results[0].vrai_total) + Number(results[0].faux_total) + Number(results[0].hors_delai_total)
                  const vrai = Number(results[0].vrai_total);
                  stat = `Il y a eu ${(vrai/total*100).toFixed(2)} % de bonnes réponses au quiz.`
                }

                const statistiques = new EmbedBuilder()
                  .setColor('#3867d6')
                  .setTitle(`<:lmdc:750836302823293010> Statistiques globales <:lmdc:750836302823293010>`)
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
                  .setAuthor({name: 'Le Max de Culture', iconURL: 'attachment://logo.png', url: 'https://le-max-de-culture.fr/'})
                message.channel.send({embeds: [statistiques], files: ['assets/images/logo.png']})
                  .catch(function(err) {
                    fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                      if(err) throw err;
                    });
                  });;
                });
            connection[0].end()
            connection.shift()
          }
        });
      connection[0].end()
      connection.shift()
    } else {
      const today = args[0];
      const j = today.split('/')
      const today2 = j[2]+"/"+j[1]+"/"+j[0];
      connection.push(createConnection({
        host: config.connexion.host,
        user: config.connexion.user,
        password: config.connexion.password,
        database: config.connexion.database
      }));
      connection[0].query(`SELECT * FROM commun_stats WHERE date = ?`, 
        [today2], 
        function(err, results){
          if(err) {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
            });
          };
          if(results[0]){
            results.forEach(e => {
              const nbMembres = client.guilds.cache.get(constantes["serveur"]).memberCount;
              const nvMembres = e['nouveaux_membres'];
              const lostMembres = e['membres_perdus'];
              const membres_actifs = JSON.parse(e['membres_actifs']);
              const nb_membres_actifs = Object.keys(membres_actifs).length;
              const salons_actifs = JSON.parse(e['salons_actifs']);
              const nb_salons_actifs = Object.keys(salons_actifs).length;            

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
                [today],
                async function(err, results) {
                  if(err) throw err;
                  if (!results[0]) {
                    stat = "Il n'y a eu aucune question répondue ce jour au quiz.";
                  } else {
                    const total = Number(results[0].vrai) + Number(results[0].faux) + Number(results[0].hors_delai);
                    const vrai = Number(results[0].vrai);
                    stat = `Il y a eu ${(vrai/total*100).toFixed(2)} % de bonnes réponses au quiz.`
                  }

                  const statistiques = new EmbedBuilder()
                    .setColor('#3867d6')
                    .setTitle(`<:lmdc:750836302823293010> Statistiques du ${args[0]} <:lmdc:750836302823293010>`)
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
                  
                  message.channel.send({embeds: [statistiques], files: ['assets/images/logo.png']})
                    .catch(function(err) {
                      fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                        if(err) throw err;
                      });
                    });;
                  });
              connection[0].end()
              connection.shift()
            });
          }
          else {
            message.channel.send("Je n'ai aucun résultat pour le jour. Format de la date : DD/MM/YYYY.");
          }
        });
      connection[0].end()
      connection.shift()
    }
  }
}