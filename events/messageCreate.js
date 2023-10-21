const { ChannelType } = require('discord.js');
const hello1 = require('../assets/hello1.json')
const hello2 = require('../assets/hello2.json')
const hello3 = require('../assets/hello3.json')
const grossier = require('../assets/grossier.json')
const { createConnection } = require('mysql2');
const config = require('../config.json')
const constantes = require('../assets/constantes.json');
const moment = require('moment-timezone');
const date = require('date');

module.exports = (client, messageCreate) => {
  const connection = []

  if (messageCreate.author.bot) return
  
  if (messageCreate.attachments.size !== 0) return
    
  const prefix = '&'
  let now = new Date().getTime();
  now = Math.round(now/1000);
  let time = now + 1296000;
  let today = moment().tz("Europe/Paris").format("YYYY/MM/DD");
  const channel = messageCreate.channel.id;
  const member = messageCreate.author.id;
  const messageClean = messageCreate.content.toLowerCase().replace(/['!"’#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g," ");

  connection.push(createConnection({
    host: config.connexion.host,
    user: config.connexion.user,
    password: config.connexion.password,
    database: config.connexion.database
  }));
  connection[0].query(`SELECT * FROM commun_stats WHERE date = ?`, 
    [today], 
    function(err, results) {
      if (err) throw err;
      if(results[0]){
        let salons_actifs = JSON.parse((results[0]['salons_actifs'] == "'{}'")?'{}':results[0]['salons_actifs']);
        let membres_actifs = JSON.parse((results[0]['membres_actifs'] == "'{}'")?'{}':results[0]['membres_actifs']);
        if(!salons_actifs[channel]){
          salons_actifs[channel] = 1;
        } else {
          salons_actifs[channel]++;
        }
        if(!membres_actifs[member]){
          membres_actifs[member] = 1;
        } else {
          membres_actifs[member]++;
        }
        connection.push(createConnection({
          host: config.connexion.host,
          user: config.connexion.user,
          password: config.connexion.password,
          database: config.connexion.database
        }));
        connection[0].query(`UPDATE commun_stats SET salons_actifs = ?, membres_actifs = ? WHERE date = ?`, 
          [JSON.stringify(salons_actifs), JSON.stringify(membres_actifs), today], 
          function(err, results){
            if(err) throw err;
          })
        connection[0].end()
        connection.shift()
      }
  });
  connection[0].end()
  connection.shift()


  if (messageCreate.channel.type === ChannelType.DM) {
    let membre = client.users.resolve(member);
    if(messageCreate.content == 'Pomme23061912'){
      client.channels.cache.get('1034470015979749436').permissionOverwrites.create(membre, {
        ViewChannel: true,
        SendMessages: true
      })
      membre.send("Félicitations pour la découverte de cet easter-egg ! Tu accèdes désormais au salon <#1034470015979749436>. Et n'oublie pas de garder le secret :shushing_face:");
      client.channels.cache.get(constantes['bureau']).send(`<@${member}> a maintenant accès au salon <#1034470015979749436> !`)
    }
    else{
      messageSplit = messageCreate.content.split(' ');
      connection.push(createConnection({
        host: config.connexion.host,
        user: config.connexion.user,
        password: config.connexion.password,
        database: config.connexion.database
      }));
      connection[0].query(`SELECT * FROM chris_avent WHERE jour = ?`, 
        [messageSplit[0]], 
        function(err, results){
          if(err) throw err;
          if(results[0]){
            const aff_horaire = new Date();
            const solution = results[0]['solution'];
            const renvoi = results[0]['renvoi'];
            const time_envoi = results[0]['timestamp'];
            let message = messageSplit[1].toLowerCase();
            if(aff_horaire.getDate() >= messageSplit[0]){
              connection.push(createConnection({
                host: config.connexion.host,
                user: config.connexion.user,
                password: config.connexion.password,
                database: config.connexion.database
              }));
              connection[0].query(`SELECT * FROM chris_avent_reponses WHERE membre = ?`, 
                [member], 
                function(err, res){
                  if(err) throw err;
                  if(res[0]){
                    var nb_essai = JSON.parse((res[0]['nb_essai'] == "'{}'")?'{}':res[0]['nb_essai']);
                    var time_correct = JSON.parse((res[0]['time_correct'] == "'{}'")?'{}':res[0]['time_correct']);
                  } else {
                    connection.push(createConnection({
                      host: config.connexion.host,
                      user: config.connexion.user,
                      password: config.connexion.password,
                      database: config.connexion.database
                    }));
                    connection[0].query(`INSERT INTO chris_avent_reponses (membre, nb_essai, time_correct) VALUES (?, ?, ?)`, 
                      [member, '{}', '{}'], 
                      function(err, res){
                          if(err) throw err;
                      })
                    connection[0].end()
                    connection.shift()
                    var nb_essai = JSON.parse('{}');
                    var time_correct = JSON.parse('{}');
                  }
                  if(message == solution){
                    if(!time_correct[messageSplit[0]]){
                      time_correct[messageSplit[0]] = now-time_envoi;
                      connection.push(createConnection({
                        host: config.connexion.host,
                        user: config.connexion.user,
                        password: config.connexion.password,
                        database: config.connexion.database
                      }));
                      connection[0].query(`UPDATE chris_avent_reponses SET nb_essai = ?, time_correct = ? WHERE membre = ?`, 
                        [JSON.stringify(nb_essai), JSON.stringify(time_correct), member], 
                        function(err, results){
                          if(err) throw err;
                        })
                      connection[0].end()
                      connection.shift()
                      return membre.send(`Félicitations, c'est une bonne réponse ! Voici un petit indice, à conserver pour plus tard : ${renvoi}`);
                    } else {
                      return membre.send(`Tu as déjà donné la bonne réponse aujourd'hui, bravo ! N'oublie pas ton indice : ${renvoi}`);
                    }
                  } else {
                    if(!time_correct[messageSplit[0]]){
                      if(!nb_essai[messageSplit[0]]){
                        nb_essai[messageSplit[0]] = 1;
                      } else {
                        nb_essai[messageSplit[0]]++;
                      }
                      connection.push(createConnection({
                        host: config.connexion.host,
                        user: config.connexion.user,
                        password: config.connexion.password,
                        database: config.connexion.database
                      }));
                      connection[0].query(`UPDATE chris_avent_reponses SET nb_essai = ?, time_correct = ? WHERE membre = ?`, 
                        [JSON.stringify(nb_essai), JSON.stringify(time_correct), member], 
                        function(err, results){
                          if(err) throw err;
                        })
                      connection[0].end()
                      connection.shift()
                      return membre.send(`Désolé, mais c'est une mauvaise réponse !`);
                    } else {
                      return membre.send(`Tu as déjà donné la bonne réponse aujourd'hui, pourquoi essayes-tu d'autres réponses ?`);
                    }
                  }
                })
              connection[0].end()
              connection.shift()
            } else {
              return membre.send(`Désolé, mais c'est une mauvaise réponse !`);
            }
          } else {
            return membre.send(`Je suis désolé, mais ta réponse n'est pas comprise. Es-tu sûr d'avoir bien employé le format "numéro_du_jour réponse" ?`);
          }
        })
      connection[0].end()
      connection.shift()
    }
  }

  if(messageCreate.content == "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️"){
    let membre = client.users.resolve(member);
    client.channels.cache.get('1034447963579228231').permissionOverwrites.create(membre, {
      ViewChannel: true,
      SendMessages: true
    })
    membre.send("Félicitations pour la découverte de cet easter-egg ! Tu accèdes désormais au salon <#1034447963579228231>. Et n'oublie pas de garder le secret :shushing_face:");
    client.channels.cache.get(constantes['bureau']).send(`<@${member}> a maintenant accès au salon <#1034447963579228231> !`)
  }

  if(messageCreate.channel.id === constantes["pub"]){
    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));
    connection[0].query(`INSERT INTO chris_pub (idm, moment) VALUES (?, ?)`, 
      [member, time], 
      function(err, results){
          if(err) throw err;
      })
    connection[0].end()
    connection.shift()
    messageCreate.channel.permissionOverwrites.create(messageCreate.author, {
      SendMessages: false
    })
  }
  
  const words = ['bonjour', 'salut', 'coucou', 'hey', 'hi', 'hello', 'yo', 'bonsoir']
  if (words.includes(messageClean)) {
    const helloMessage1 = hello1[Math.floor(Math.random() * hello1.length)]
    messageCreate.channel.send(helloMessage1)
    const filter = m => m.author.id === member;
    const collector = messageCreate.channel.createMessageCollector({filter, time: 30000, max: 1 })

    collector.on('collect', m => {
      const answers = ['toi', 'vous']
      for (const answer of answers) {
        const words = m.content.toLowerCase().trim().split(' ')
        const test = words.some(word => {
          return answer.toLowerCase().includes(word)
        })

        if (test && words.includes(answer.toLowerCase())) {
          const helloMessage2 = hello2[Math.floor(Math.random() * hello2.length)]
          return messageCreate.channel.send(helloMessage2)
        }
      }

      const answers2 = ['robot', 'vilain', 'tas', 'ferraille', 'pue', 'espece', 'espèce', 'chut']
      for (const answer of answers2) {
        const words = m.content.toLowerCase().trim().split(' ')
        const test = words.some(word => {
          return answer.toLowerCase().includes(word)
        })

        if (test && words.includes(answer.toLowerCase())) {
          const helloMessage3 = hello3[Math.floor(Math.random() * hello3.length)]
          return messageCreate.channel.send(helloMessage3)
        }
      }
    })
  }

  const messageContent = messageClean.trim().split(' ');
  let isAbusive = false;
  for (const ab of global.insultes) {
    if(messageContent.includes(ab)){
      isAbusive = true
    }
  }

  if(isAbusive){
    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));
    connection[0].query(`INSERT INTO chris_vocabulaire (membre, horaire, message) VALUES (?, ?, ?)`, 
      [member, now, messageCreate.url], 
      function(err, results){
          if(err) throw err;
      })
    connection[0].end()
    connection.shift()
    connection.push(createConnection({
      host: config.connexion.host,
      user: config.connexion.user,
      password: config.connexion.password,
      database: config.connexion.database
    }));
    connection[0].query(`SELECT COUNT(*) as nb FROM chris_vocabulaire WHERE membre = ? AND horaire > ?`, 
      [member, now-604800],
      function(err, results) {
        if(err) throw err;
        if(results[0]){
          if(results[0].nb >= 3){
            connection.push(createConnection({
              host: config.connexion.host,
              user: config.connexion.user,
              password: config.connexion.password,
              database: config.connexion.database
            }));
            connection[0].query(`SELECT * FROM chris_vocabulaire WHERE membre = ? AND horaire > ?`, 
              [member, now-604800],
              function(err, result){
                if(err)  throw err;
                // client.channels.cache.get(constantes["report"]).send('@everyone');
                client.channels.cache.get(constantes["report"]).send(`Vocabulaire injurieux à répétition de la part de <@${member}>`);
                client.channels.cache.get(constantes["report"]).send(`Messages gênants :`);
                result.forEach(e => {
                  client.channels.cache.get(constantes["report"]).send(e.message);
                })
              }
            );
            connection[0].end()
            connection.shift()
          }
        }
      }
    );
    connection[0].end()
    connection.shift()
    const grossierMessage = grossier[Math.floor(Math.random() * grossier.length)]
    return messageCreate.channel.send(grossierMessage)
  }

  if(messageCreate.content.substr(-6) == 'quoi ?' && Math.floor(Math.random() * 4) == 0){
    messageCreate.reply('feur !');
  }

  if (!messageCreate.content.startsWith(prefix)) return;

  const args = messageCreate.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if(cmd.length === 0) return;


  let command = client.commands.get(cmd);

  if(!command) command = client.commands.get(client.aliases.get(cmd));

  if(!command) return messageCreate.reply({content: `${prefix+cmd} n'existe pas.`});

  command.execute(client, messageCreate, args)
}
