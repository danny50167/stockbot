const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { apiKey } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(interaction) {
    const apiLink = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=${apiKey}`;
    // const apiLink = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=88J02IFT5LJAUZP6`;
    const response = await axios.get(apiLink);
    // console.log(response.data);
    const data = response.data;

    const core =
      data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]];
    const price = core["4. close"];

    await interaction.reply(price);
  },
};
