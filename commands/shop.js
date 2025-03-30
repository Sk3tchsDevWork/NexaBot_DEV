const { SlashCommandBuilder } = require('discord.js');
const shopConfig = require('../config/shopConfig.json');
const User = require('../models/User'); // Ensure User is correctly imported

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Spend your coins in the shop')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('The item you want to buy')
        .setRequired(true)
        .addChoices(
          ...Object.keys(shopConfig.shopItems).map(item => ({
            name: item.replace('_', ' '),
            value: item,
          }))
        )),
  async execute(interaction) {
    const userId = interaction.user.id;
    const user = new User(userId);

    console.log("User object:", user); // Debugging output

    if (!user) {
      return interaction.reply({ content: 'Error: Could not retrieve user data.', ephemeral: true });
    }

    const item = interaction.options.getString('item');
    const prices = shopConfig.shopItems;

    if (user.totalRewards < prices[item]) {
      return interaction.reply({ content: 'You do not have enough coins to buy this item.', ephemeral: true });
    }

    // Deduct the price from the user's balance
    user.totalRewards -= prices[item];

    try {
      user.save();
      await interaction.reply(`🛒 You purchased **${item.replace('_', ' ')}** for **${prices[item]} coins**!`);
    } catch (error) {
      console.error('Error saving user data:', error);
      return interaction.reply({ content: 'An error occurred while processing your purchase.', ephemeral: true });
    }
  },
};
