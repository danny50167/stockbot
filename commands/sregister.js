const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { apiKey } = require("../config.json");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sregister")
    .setDescription("Registers you to the Database!"),

  async execute(interaction) {
    // 1. check if server is registered
    let DBPath = path.join(__dirname + "/../DB");

    try {
      fs.mkdirSync(`${DBPath}/${interaction.guild.id}`);
    } catch (error) {}

    DBPath += `/${interaction.guild.id}`;

    // 2. check if user already registered
    if (fs.readdirSync(DBPath).includes(`${interaction.user.id}.json`)) {
      await interaction.reply("you already registerd!");
    } else {
      // 3. register user
      fs.writeFileSync(
        `${DBPath}/${interaction.user.id}.json`,
        JSON.stringify({
          id: interaction.user.id,
          username: interaction.user.username,
          balance: 500,
          stocks: {
            AAPL: {
              avg: 0,
              amount: 0,
            },
            TSLA: {
              avg: 0,
              amount: 0,
            },
            NFLX: {
              avg: 0,
              amount: 0,
            },
            AMZN: {
              avg: 0,
              amount: 0,
            },
            META: {
              avg: 0,
              amount: 0,
            },
          },
        })
      );

      const embed = new EmbedBuilder()
        .setTitle("Register Complete!")
        .setColor(0x565bfc)
        .setDescription("Now you have access to the virtual-stockmarket!")
        .addFields(
          {
            name: "balance",
            value: "500",
            inline: true,
          },
          {
            name: "owning stocks",
            value: "0",
            inline: true,
          }
        )
        .setTimestamp();

      await interaction.channel.send({ embeds: [embed] });
    }
  },
};
