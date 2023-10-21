const { createConnection } = require('mysql2');
const config = require('../config.json')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'quote',
  aliases: ['citation'],
  description: 'Utilisation : &citation | Permet d\'afficher une citation au hasard.',
  execute: async (_client, message, args) => {
    const connection = []
    
    if(!args[0]){
      connection.push(createConnection({
        host: config.connexion.host,
        user: config.connexion.user,
        password: config.connexion.password,
        database: config.connexion.database
      }));  
      connection[0].query(`SELECT * FROM commun_citations WHERE supp = 1 ORDER BY RAND() LIMIT 1`, 
        function(err, results){
          if(err) {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                if(err) throw err;
            });
          };
          if(results[0]){
            results.forEach(e => {
              message.channel.send(`« ${e.citation} » — ${e.auteur}`);
            })
          }
        });
      connection[0].end()
      connection.shift()
    }
    else {
      const argument = args.join(' ');
      var kw = '%'+argument+'%';
      connection.push(createConnection({
        host: config.connexion.host,
        user: config.connexion.user,
        password: config.connexion.password,
        database: config.connexion.database
      }));
      connection[0].query(`SELECT * FROM commun_citations WHERE supp = 1 AND (auteur LIKE ? OR citation LIKE ?)`, 
        [kw,kw],
        function(err, results){
          if(err) {
            fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
              if(err) throw err;
            });
          };
          if(results[0]){
            results.forEach(e => {
              message.channel.send(`« ${e.citation} » — ${e.auteur}`);
            })
            message.channel.send(`Et c'est tout !`)
          } else {
            message.channel.send(`Aucune citation de cet auteur, ou contenant ces mots. Vérifiez l'orthographe, ou proposez-en !`);
          }
        });
      connection[0].end()
      connection.shift()
    }
  }
}