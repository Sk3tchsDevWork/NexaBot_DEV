const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('[PREMIUM] Play music in a voice channel')
    .addSubcommand(subcommand =>
      subcommand
        .setName('play')
        .setDescription('Play a song')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('Song name or URL')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('stop')
        .setDescription('Stop the music')),
  async execute(interaction, client) {
    // Check if the guild has premium access
    if (!client.premiumGuilds || !client.premiumGuilds.has(interaction.guild.id)) {
      return interaction.reply({ content: 'This is a premium feature! Use `/premium` to upgrade.', ephemeral: true });
    }

    // Ensure the user is in a voice channel
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    const player = Player.singleton(client); // Use a singleton instance of the player

    if (subcommand === 'play') {
      await interaction.deferReply();

      const query = interaction.options.getString('query');
      const queue = player.createQueue(interaction.guild, {
        metadata: { channel: interaction.channel },
      });

      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        queue.destroy();
        return interaction.editReply({ content: 'Could not join your voice channel!' });
      }

      const searchResult = await player.search(query, {
        requestedBy: interaction.user,
      });

      if (!searchResult || !searchResult.tracks.length) {
        return interaction.editReply({ content: 'No results found!' });
      }

      const track = searchResult.tracks[0];
      queue.addTrack(track);

      if (!queue.playing) await queue.play();

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Now Playing')
        .setDescription(`[${track.title}](${track.url}) (${track.duration})`)
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

      await interaction.editReply({ embeds: [embed] });
    } else if (subcommand === 'stop') {
      const queue = player.getQueue(interaction.guild);
      if (!queue || !queue.playing) {
        return interaction.reply({ content: 'No music is currently playing!', ephemeral: true });
      }

      queue.destroy();
      await interaction.reply('Stopped the music and cleared the queue!');
    }
  },
};