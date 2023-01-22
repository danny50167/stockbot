const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
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
    const apiLink = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;
    // `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=88J02IFT5LJAUZP6`;

    const response = await axios.get(apiLink);
    // // console.log(response.data);
    const data = response.data;

    const core =
      data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]];
    const price = core["4. close"];

    await interaction.reply(`> **Today's AAPL stock price is __$${price}!__**\n*All prices are updated every day!*`);
  },
};
