const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member in the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for muting the member')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);

    if (!member) {
      return interaction.reply({ content: 'User not found in this server!', ephemeral: true });
    }

    const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
    if (!mutedRole) {
      return interaction.reply({ content: 'Muted role not found! Please create a "Muted" role.', ephemeral: true });
    }

    await member.roles.add(mutedRole);
    await interaction.reply(`${target.tag} has been muted. Reason: ${reason}`);
  },
};