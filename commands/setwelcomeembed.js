const { SlashCommandBuilder } = require('discord.js');
const db = require('../database'); // Use SQLite or your database setup

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcomeembed')
    .setDescription('Customize the welcome embed message')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the welcome embed')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('The description of the welcome embed')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('color')
        .setDescription('The color of the welcome embed (hex format, e.g., #00FF00)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('thumbnail')
        .setDescription('The URL of the thumbnail image')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('footer')
        .setDescription('The footer text of the welcome embed')
        .setRequired(false)),
  async execute(interaction) {
    // Ensure the user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Get the options provided by the admin
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color');
    const thumbnail = interaction.options.getString('thumbnail');
    const footer = interaction.options.getString('footer');

    // Store the settings in the database
    if (title) db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeTitle', title);
    if (description) db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeDescription', description);
    if (color) db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeColor', color);
    if (thumbnail) db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeThumbnail', thumbnail);
    if (footer) db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('welcomeFooter', footer);

    await interaction.reply('✅ Welcome embed message has been updated!');
  },
};