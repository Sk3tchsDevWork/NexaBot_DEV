const { SlashCommandBuilder } = require('discord.js');
const db = require('../database'); // Import the SQLite database
const shopConfig = require('../config/shopConfig.json'); // Import shop configuration

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily rewards!'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Fetch user data from the database
    let user = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);

    if (user) {
      const timeLeft = cooldown - (now - user.lastClaim);

      if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return interaction.reply({
          content: `⏳ You have already claimed your daily reward! Please try again in ${hours}h ${minutes}m.`,
          flags: 64, // Use flags instead of ephemeral
        });
      }

      const streakWindow = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
      if (now - user.lastClaim <= streakWindow) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
    } else {
      // Create a new user entry if they don't exist
      user = { userId, lastClaim: now, streak: 1, totalRewards: 0 };
      db.prepare('INSERT INTO users (userId, lastClaim, streak, totalRewards) VALUES (?, ?, ?, ?)')
        .run(userId, now, 1, 0);
    }

    const baseReward = Math.floor(Math.random() * 100) + 50;
    const streakBonus = user.streak * 10;
    let totalReward = baseReward + streakBonus;

    // Access streak milestones dynamically
    const milestoneRewards = shopConfig.streakMilestones;
    if (milestoneRewards[user.streak]) {
      const milestoneReward = milestoneRewards[user.streak];
      totalReward += milestoneReward;
      await interaction.followUp(`🎉 Bonus! You earned **${milestoneReward} coins** for reaching a **${user.streak}-day streak milestone**!`);
    }

    // Update user data in the database
    user.lastClaim = now;
    user.totalRewards += totalReward;
    db.prepare('UPDATE users SET lastClaim = ?, streak = ?, totalRewards = ? WHERE userId = ?')
      .run(user.lastClaim, user.streak, user.totalRewards, userId);

    await interaction.reply(`🎉 You claimed your daily reward of **${totalReward} coins**! (Base: ${baseReward} + Streak Bonus: ${streakBonus})`);
  },
};