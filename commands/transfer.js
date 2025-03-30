const { SlashCommandBuilder } = require('discord.js');
const db = require('../database'); // Import the SQLite database

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer coins to another user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to transfer coins to')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of coins to transfer')
        .setRequired(true)),
  async execute(interaction) {
    const senderId = interaction.user.id;
    const target = interaction.options.getUser('target');
    const amount = interaction.options.getInteger('amount');

    if (amount <= 0) {
      return interaction.reply({ content: 'You must transfer a positive amount of coins.', ephemeral: true });
    }

    const sender = db.prepare('SELECT * FROM users WHERE userId = ?').get(senderId);
    const recipient = db.prepare('SELECT * FROM users WHERE userId = ?').get(target.id);

    if (!sender || sender.totalRewards < amount) {
      return interaction.reply({ content: 'You do not have enough coins to transfer.', ephemeral: true });
    }

    if (!recipient) {
      return interaction.reply({ content: 'The recipient does not have an account yet.', ephemeral: true });
    }

    // Transfer coins
    sender.totalRewards -= amount;
    recipient.totalRewards += amount;

    db.prepare('UPDATE users SET totalRewards = ? WHERE userId = ?').run(sender.totalRewards, senderId);
    db.prepare('UPDATE users SET totalRewards = ? WHERE userId = ?').run(recipient.totalRewards, target.id);

    await interaction.reply(`💸 You transferred **${amount} coins** to <@${target.id}>!`);
  },
};