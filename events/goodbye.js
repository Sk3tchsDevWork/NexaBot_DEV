module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
      const goodbyeChannel = member.guild.channels.cache.find(
        channel => channel.name === 'goodbye' // Replace 'goodbye' with your desired channel name
      );
  
      if (!goodbyeChannel) return;
  
      const goodbyeMessage = `😢 <@${member.id}> has left the server. We'll miss you!`;
      await goodbyeChannel.send(goodbyeMessage);
    },
  };