const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all commands'),
  async execute(interaction, client) {
    const freeCommands = client.commands
      .filter(cmd => !cmd.premium)
      .map(cmd => `\`/${cmd.data.name}\`: ${cmd.data.description}`)
      .join('\n') || 'No free commands available.';
    const premiumCommands = client.commands
      .filter(cmd => cmd.premium)
      .map(cmd => `\`/${cmd.data.name}\`: ${cmd.data.description}`)
      .join('\n') || 'No premium commands available. Use `/premium` to upgrade!';

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('One-Stop Bot Commands')
      .addFields(
        { name: 'Free Commands', value: freeCommands, inline: false },
        { name: 'Premium Commands', value: premiumCommands, inline: false }
      )
      .setFooter({ text: 'Use /premium for more info!' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};