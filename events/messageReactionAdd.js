const reactionRoles = require('../config/reactionRoles.json');

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user) {
    // Ignore bot reactions
    if (user.bot) return;

    // Fetch the message if it's not cached
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    // Check if the reaction is on the correct message
    if (reaction.message.id !== reactionRoles.messageId) return;

    // Get the role name from the emoji
    const roleName = reactionRoles.roles[reaction.emoji.name];
    if (!roleName) return;

    // Get the guild member and role
    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
      console.error(`Role "${roleName}" not found in guild "${guild.name}".`);
      return;
    }

    // Add the role to the user
    try {
      await member.roles.add(role);
      console.log(`Added role "${roleName}" to user "${user.tag}".`);
    } catch (error) {
      console.error(`Failed to add role "${roleName}" to user "${user.tag}":`, error);
    }
  },
};