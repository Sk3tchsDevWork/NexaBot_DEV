const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('redeem')
    .setDescription('Redeem a premium code')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('Your premium code')
        .setRequired(true)),
  async execute(interaction, client) {
    const code = interaction.options.getString('code');
    const validCodes = ['PREMIUM123', 'BOTROCKS456', 'ONESTOP789', 'TESTCODE2025'];

    if (!validCodes.includes(code)) {
      return interaction.reply({ content: 'Invalid code!', flags: 64 });
    }

    if (client.premiumGuilds.has(interaction.guild.id)) {
      return interaction.reply({ content: 'This server already has premium!', flags: 64 });
    }

    client.premiumGuilds.add(interaction.guild.id);
    fs.writeFileSync('./premium.json', JSON.stringify({ premiumGuilds: [...client.premiumGuilds] }, null, 2));
    await interaction.reply('Premium activated! Enjoy `/reactionrole` and more.');
  },
};