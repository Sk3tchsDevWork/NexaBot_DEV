
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      if (!data.url) throw new Error('No meme found');

      const embed = new EmbedBuilder()
        .setColor('#FF9900')
        .setTitle(data.title)
        .setImage(data.url)
        .setFooter({ text: `Source: ${data.subreddit}` });
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Meme Error:', error);
      await interaction.editReply({ content: 'Failed to fetch a meme!', flags: 64 });
    }
  },
};
