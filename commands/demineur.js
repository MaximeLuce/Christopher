const { EmbedBuilder } = require('discord.js')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
  name: 'demineur',
  aliases: ['minesweeper', 'ms', 'démineur'],
  description: 'Utilisation &démineur [largeur] [hauteur] | Permet de générer une grille de démineur aux dimensions voulues (maximum 99 cases).',
  execute: async (_client, message, args) => {

    const tab = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':boom:', '`0`', '`1`', '`2`', '`3`', '`4`', '`5`', '`6`', '`7`', '`8`', '`X`'];

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generer_demineur(l,h,n){
      const maxi = l*h;
      let plus;
      if(maxi > 99){
        plus = 10;
      }
      else{
        plus = 0;
      }

      let b = [];
      let r;
      for (var i = 0; i < n; i++) {
        r = getRandomIntInclusive(0,maxi-1);
        while(b.includes(r)){
          r = getRandomIntInclusive(0,maxi-1);
        }
        b.push(r);
      }

      let dem = [];
      for(var x = 0; x < h; x++){
        dem.push([])
        for(var y = 0; y < l; y++){
          if(b.includes(x*l+y)){
            dem[dem.length-1].push(tab[9+plus]);
          } else {
            dem[dem.length-1].push('');
          }
        }
      }

      for(var x = 0; x < h; x++){
        for(var y = 0; y < l; y++){
          if(dem[x][y] !== tab[9+plus]){
            let n = 0;
            for(var i = x-1; i < x+2; i++){
              for(var j = y-1; j < y+2; j++){
                if(i != x || j != y){
                  if(dem[i] && dem[i][j] && dem[i][j] === tab[9+plus]){
                    n++;
                  }
                }
              }
            }
            dem[x][y] = tab[n+plus];
          }
        }
      }
      return dem;
    }

    let l; let h; let n;
    
    if(args.length === 2 && args[0] == parseInt(args[0]) && args[1] == parseInt(args[1])){
      l = args[0];
      h = args[1];
      if(l < 4){
        l = 4;
      }
      if(h < 4){
        h = 4;
      }
      if(l*h > 99){
        l = 9;
        h = 9;
      }
      n = Math.floor(l*h/6);
    }
    else {
      l = 9;
      h = 9;
      n = 12;
    }

    const grid = generer_demineur(l,h,n);
      
    const mineur = new EmbedBuilder()
      .setTitle('Démineur')
      .setDescription(grid.map(element => element.map(elements => `||${elements}||`).join(" ")).join('\n'))
      .setColor('#3867d6')
    
    return message.channel.send({embeds: [mineur]})
            .catch(function(err) {
                fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
                    if(err) throw err;
                });
            });
  }
}