const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a random number')
    .addIntegerOption(option =>
      option.setName('min')
        .setDescription('The minimum number (default: 1)')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('max')
        .setDescription('The maximum number (default: 100)')
        .setRequired(false)),
  async execute(interaction) {
    const min = interaction.options.getInteger('min') || 1;
    const max = interaction.options.getInteger('max') || 100;

    if (min >= max) {
      return interaction.reply({ content: 'The minimum number must be less than the maximum number!', ephemeral: true });
    }
    if (min < 1) {
      return interaction.reply({ content: 'The minimum number must be at least 1!', ephemeral: true });
    }

    const roll = Math.floor(Math.random() * (max - min + 1)) + min;

    let response = `You rolled a **${roll}** (${min}-${max})!`;
    if (roll === max) {
      response += ` 🎉 Congratulations! You hit the highest possible number!`;
    }

    await interaction.reply(response);
  },
};