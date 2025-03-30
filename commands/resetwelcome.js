const { SlashCommandBuilder } = require('discord.js');
const db = require('../database'); // Use SQLite or your database setup

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetwelcome')
    .setDescription('Reset the welcome embed settings to their default values'),
  async execute(interaction) {
    // Ensure the user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Remove custom settings from the database
    db.prepare('DELETE FROM settings WHERE key = ?').run('welcomeTitle');
    db.prepare('DELETE FROM settings WHERE key = ?').run('welcomeDescription');
    db.prepare('DELETE FROM settings WHERE key = ?').run('welcomeColor');
    db.prepare('DELETE FROM settings WHERE key = ?').run('welcomeThumbnail');
    db.prepare('DELETE FROM settings WHERE key = ?').run('welcomeFooter');

    await interaction.reply('✅ Welcome embed settings have been reset to their default values.');
  },
};