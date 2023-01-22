const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sbalance")
    .setDescription("Replies with your balance")
    .addStringOption((option) =>
      option
        .setName("mode")
        .setDescription("Should I send publically?")
        .setRequired(true)
        .addChoices(
          { name: "Public 📢", value: "public" },
          { name: "Private 🔒", value: "private" }
        )
    ),
  async execute(interaction) {
    const mode = interaction.options._hoistedOptions[0].value;
    const isPrivate = mode == "private";

    const user = require(`../DB/${interaction.guild.id}/${interaction.user.id}.json`);

    let fields = [];
    Object.keys(user.stocks).forEach((stockName) => {
      const stock = user.stocks[stockName];

      fields.push({
        name: stockName,
        value: `Average: ${stock.avg}, Amount: ${stock.avg}`,
        inline: false,
      });
    });

    const embed = new EmbedBuilder()
      .setTitle("Your Balance")
      .setDescription("The total of your possession")
      .setColor(0x565bfc)
      .addFields(fields)
      .setTimestamp();

    console.log(isPrivate);

    await interaction.reply({
      embeds: [embed],
      ephemeral: isPrivate,
    });
  },
};
