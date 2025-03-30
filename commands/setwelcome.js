const { SlashCommandBuilder } = require('discord.js');
const db = require('../database'); // Use SQLite or your database setup

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Set the welcome channel for new members')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send welcome messages to')
        .setRequired(true)),
  async execute(interaction) {
    // Ensure the user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    // Save the channel ID to the database
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
      .run('welcomeChannel', channel.id);

    await interaction.reply(`✅ Welcome channel has been set to <#${channel.id}>.`);
  },
};