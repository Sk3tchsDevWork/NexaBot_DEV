const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('[PREMIUM] Assign a role with a reaction')
    .addStringOption(option =>
      option.setName('messageid')
        .setDescription('ID of the message to react to')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('emoji')
        .setDescription('Emoji to react with')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to assign')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  premium: true,
  async execute(interaction, client) {
    if (!client.premiumGuilds.has(interaction.guild.id)) {
      return interaction.reply({ content: 'This is a premium feature! Use `/premium` to upgrade.', flags: 64 });
    }

    const messageId = interaction.options.getString('messageid');
    const emoji = interaction.options.getString('emoji');
    const role = interaction.options.getRole('role');

    const channel = interaction.channel;
    const message = await channel.messages.fetch(messageId).catch(() => null);
    if (!message) return interaction.reply({ content: 'Invalid message ID!', flags: 64 });

    try {
      await message.react(emoji);
    } catch (error) {
      return interaction.reply({ content: 'Invalid emoji or I lack permission to react!', flags: 64 });
    }

    client.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.message.id === messageId && reaction.emoji.name === emoji && !user.bot) {
        const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
        if (member) await member.roles.add(role).catch(() => null);
      }
    });
    client.on('messageReactionRemove', async (reaction, user) => {
      if (reaction.message.id === messageId && reaction.emoji.name === emoji && !user.bot) {
        const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
        if (member) await member.roles.remove(role).catch(() => null);
      }
    });

    await interaction.reply(`Set up reaction role: ${emoji} → ${role.name} on message ${messageId}`);
  },
};