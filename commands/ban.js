const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for banning the member')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: 'User not found in this server!', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: 'I cannot ban this user. They might have a higher role or I lack permissions.', ephemeral: true });
    }

    await member.ban({ reason });
    await interaction.reply(`${target.tag} has been banned. Reason: ${reason}`);
  },
};