const { SlashCommandBuilder } = require('discord.js');
const User = require('../models/User'); // Import the User class

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your coin balance'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const user = new User(userId); // Create a User instance

    // Check if user has rewards
    if (!user || user.totalRewards === 0) {
      return interaction.reply({ content: 'You have no coins yet! Use `/daily` to start earning.', ephemeral: true });
    }

    await interaction.reply(`💰 You currently have **${user.totalRewards} coins**.`);
  },
};