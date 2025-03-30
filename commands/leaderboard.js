const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database'); // Import the SQLite database
const User = require('../models/User'); // Import the User model

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the top users by streak or total rewards')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Leaderboard type: streak or rewards')
        .setRequired(true)
        .addChoices(
          { name: 'Streak', value: 'streak' },
          { name: 'Total Rewards', value: 'rewards' }
        )),
  async execute(interaction) {
    const type = interaction.options.getString('type');
    const sortField = type === 'streak' ? 'streak' : 'totalRewards';

    // Fetch top 10 users sorted by the selected field
    const topUsers = db.prepare(`SELECT * FROM users ORDER BY ${sortField} DESC LIMIT 10`).all();

    if (!topUsers.length) {
      return interaction.reply({ content: 'No data available for the leaderboard.', ephemeral: true });
    }

    // Create an embed for the leaderboard
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(`🏆 ${type === 'streak' ? 'Streak' : 'Total Rewards'} Leaderboard`)
      .setDescription(
        topUsers
          .map((user, index) => 
            `**${index + 1}.** <@${user.userId}> - ${user[sortField]} ${type === 'streak' ? 'days' : 'coins'}`
          )
          .join('\n')
      )
      .setThumbnail(interaction.guild.iconURL()) // Add server icon
      .setFooter({ text: 'Keep participating to climb the leaderboard!' });

    await interaction.reply({ embeds: [embed] });
  },
};