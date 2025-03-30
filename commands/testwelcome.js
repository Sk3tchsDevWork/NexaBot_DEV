const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database'); // Use SQLite or your database setup

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('Test the welcome message in the configured channel'),
  async execute(interaction) {
    // Ensure the user has admin permissions
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Fetch the welcome channel ID from the database
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeChannel');
    const welcomeChannelId = row ? row.value : null;

    if (!welcomeChannelId) {
      return interaction.reply({ content: 'No welcome channel has been set. Use `/setwelcome` to configure it.', ephemeral: true });
    }

    const welcomeChannel = interaction.guild.channels.cache.get(welcomeChannelId);

    if (!welcomeChannel || !welcomeChannel.isTextBased()) {
      return interaction.reply({ content: `The configured welcome channel (ID: ${welcomeChannelId}) is not valid or is not a text channel.`, ephemeral: true });
    }

    // Fetch the embed settings from the database
    const title = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeTitle')?.value || 'Welcome!';
    const description = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeDescription')?.value ||
      `🎉 Welcome to **${interaction.guild.name}**, <@${interaction.user.id}>! We're glad to have you here. Make sure to check out the rules and have fun!`;
    const color = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeColor')?.value || '#00FF00';
    const thumbnail = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeThumbnail')?.value || interaction.user.displayAvatarURL();
    const footer = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeFooter')?.value || `Member #${interaction.guild.memberCount}`;

    // Create an embed for the welcome message
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(thumbnail)
      .setFooter({ text: footer });

    // Send the embed to the welcome channel
    try {
      await welcomeChannel.send({ embeds: [embed] });
      await interaction.reply({ content: `✅ Test welcome message sent to <#${welcomeChannelId}>.`, ephemeral: true });
    } catch (err) {
      console.error(`Failed to send test welcome message: ${err}`);
      await interaction.reply({ content: '❌ Failed to send the test welcome message. Check the bot\'s permissions.', ephemeral: true });
    }
  },
};