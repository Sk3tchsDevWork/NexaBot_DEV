const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get info about a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get info about')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'User not found in this server!', flags: 64 });

    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle(`${user.tag} Info`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Registered', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ') || 'None', inline: false }
      );
    await interaction.reply({ embeds: [embed] });
  },
};