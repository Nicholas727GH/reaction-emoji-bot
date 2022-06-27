const discord = require('discord.js');
const DS = require('discord.js-selfbot-v13');
const fs = require('fs');
require('dotenv').config();

const reactions = require('./reactions.json'); // Reaction ID database
const config = {
	owner: '561431845644926976',
	server: '759539934557110272',
	emoji_min: 7,
};

const client = new DS.Client();
client.login(process.env.CLIENT);
client.on('ready', () => console.log('Client Ready!'));

client.on('messageCreate', async (message) => {
	if (!message.author.bot) return;
	if (message.components.length === 0) return;

	let rows = message.components.filter((component) => component.type === 'ACTION_ROW');
	if (rows.length === 0) return;

	let buttons = rows[0].components.filter((c) => c.type === 'BUTTON').filter((b) => b.disabled === false);

	await buttons[0].click(message);
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reactions.ids.includes(reaction.message.id)) return;
	let msg = await reaction.message.fetch();
	if (!msg.author.bot || reaction.me) return;
	if (reaction.count < config.emoji_min) return;

	let emoji = reaction.emoji;
	msg.react(emoji);

	// Update reactions database
	reactions.ids.push(msg.id);
});
