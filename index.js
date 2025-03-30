const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const db = require('./database'); // Import the SQLite database

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: ['MESSAGE', 'REACTION', 'USER'], // Enable partials for uncached messages and reactions
});

client.commands = new Collection();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1355379481405034607';
const premiumData = require('./premium.json');
client.premiumGuilds = new Set(premiumData.premiumGuilds);

// Load events
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (!command.data || !command.data.name) {
    console.error(`Skipping ${file} - missing or invalid 'data' property`);
    continue;
  }
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  const commands = client.commands.map(cmd => cmd.data.toJSON());
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  console.log('Successfully registered slash commands!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Something went wrong!', ephemeral: true });
  }
});

client.login(TOKEN);