const {
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("It's a great example for discord.js buttons"),
  async execute(interaction) {
    const button = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("btn")
        .setLabel("Click me!")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: "I think you should",
      components: [button],
    });

    const collector = interaction.channel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      // what to do when btn clicked
      await i.update({
        content: "the button has been clicked!",
        // components: [button],
      });
    });
  },
};
