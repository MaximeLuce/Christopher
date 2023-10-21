const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const { createConnection } = require('mysql2');
const config = require('../config.json')
const fs = require('fs')
const aff_horaire = new Date();
const log = './log.txt';

module.exports = {
	name: 'test',
	aliases: ['test'],
	description: 'Utilisation &test.',
	execute: async (_client, messageCreate, args) => {
		const row = new ActionRowBuilder()
		    .addComponents(
		        new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle(ButtonStyle.Primary),
		    );
		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');

		messageCreate.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] })
	      .catch(function(err) {
	        fs.appendFile(`${log}`, `${aff_horaire} — ${err}\n`, (err) => {
	          if(err) throw err;
	        });
	      });
	}
}