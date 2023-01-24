const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { updateStocks } = require("./functions/updateStocks");
const { apiKey } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sprice")
    .setDescription("Replies with the stock's price!")
    .addStringOption((option) =>
      option
        .setName("symbol")
        .setDescription("The name of the company.")
        .setRequired(true)
        .addChoices(
          { name: "Apple", value: "AAPL" },
          { name: "Tesla", value: "TSLA" },
          { name: "Netflix", value: "NFLX" },
          { name: "Amazon", value: "AMZN" },
          { name: "Meta(facebook)", value: "META" }
        )
    ),

  async execute(interaction) {
    const symbol = interaction.options._hoistedOptions[0].value;
    updateStocks();
    const stockInfo = require("../DB/stockInfo.json");
    const price = stockInfo[symbol].slice(0, -2);

    await interaction.reply(
      `> **Today's AAPL stock price is __$${price}__**\n*All prices are updated every day!*`
    );
  },
};
