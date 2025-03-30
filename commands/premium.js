const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('premium')
    .setDescription('Check premium status or upgrade'),
  async execute(interaction, client) {
    const isPremium = client.premiumGuilds.has(interaction.guild.id);
    const embed = new EmbedBuilder()
      .setColor(isPremium ? '#FFD700' : '#FF0000')
      .setTitle('Premium Status')
      .setDescription(
        isPremium
          ? 'This server has premium! Enjoy features like `/reactionrole`.'
          : 'Unlock premium for $2/month to get `/reactionrole` and more! Use `/redeem` with a code from [yourwebsite.com].'
      );
    await interaction.reply({ embeds: [embed] });
  },
};