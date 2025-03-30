const { EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // Fetch the welcome channel ID from the database
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeChannel');
    const welcomeChannelId = row ? row.value : null;

    if (!welcomeChannelId) {
      console.log(`No welcome channel has been set for guild "${member.guild.name}".`);
      return;
    }

    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    if (!welcomeChannel || !welcomeChannel.isTextBased()) {
      console.log(`Welcome channel with ID "${welcomeChannelId}" not found or is not a text channel.`);
      return;
    }

    // Fetch the embed settings from the database
    const title = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeTitle')?.value || 'Welcome!';
    const description = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeDescription')?.value ||
      `🎉 Welcome to **${member.guild.name}**, <@${member.id}>! We're glad to have you here. Make sure to check out the rules and have fun!`;
    const color = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeColor')?.value || '#00FF00';
    const thumbnail = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeThumbnail')?.value || member.user.displayAvatarURL();
    const footer = db.prepare('SELECT value FROM settings WHERE key = ?').get('welcomeFooter')?.value || `Member #${member.guild.memberCount}`;

    // Create the default embed for the welcome message
    const embed = new EmbedBuilder()
      .setColor(color) // Default or custom color
      .setTitle(title) // Default or custom title
      .setDescription(description) // Default or custom description
      .setThumbnail(thumbnail) // Default or custom thumbnail
      .setFooter({ text: footer }); // Default or custom footer

    // Send the embed to the welcome channel
    await welcomeChannel.send({ embeds: [embed] });

    // Optional: Assign a default role to the new member
    const defaultRoleName = 'Member'; // Replace with your desired default role name
    const defaultRole = member.guild.roles.cache.find(role => role.name === defaultRoleName);

    if (defaultRole) {
      try {
        await member.roles.add(defaultRole);
      } catch (err) {
        console.log(`Failed to assign the default role to ${member.user.tag}:`, err);
      }
    }

    // Optional: Send a DM to the new member
    try {
      await member.send(`Welcome to **${member.guild.name}**! We're glad to have you here. Make sure to check out the server rules and enjoy your stay!`);
    } catch (err) {
      console.log(`Could not send a DM to ${member.user.tag}:`, err);
    }
  },
};