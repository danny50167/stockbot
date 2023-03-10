const fs = require("node:fs");
const path = require("node:path");
const { apiKey } = require("../../config.json");
const axios = require("axios");

const updateStocks = () => {
  const dirPath = path.join(__dirname, "../../DB");
  console.log(dirPath);
  const jsonPath = dirPath + "/stockInfo.json";
  let stockInfo = JSON.parse(fs.readFileSync(jsonPath, { encoding: "utf-8" }));
  const date = new Date().toISOString().substring(0, 10);

  if (date == stockInfo.update) return;

  stockInfo.update = date;
  fs.writeFileSync(jsonPath, JSON.stringify(stockInfo), {
    encoding: "utf-8",
  });

  Object.keys(stockInfo).forEach((key) => {
    if (key == "update") return;
    const apiLink = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${key}&interval=1min&apikey=${apiKey}`;
    axios.get(apiLink).then((res) => {
      const data = res.data;
      const core =
        data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]];
      const price = core["4. close"];

      stockInfo[key] = price;

      fs.writeFileSync(jsonPath, JSON.stringify(stockInfo), {
        encoding: "utf-8",
      });
    });
  });
};

module.exports = {
  updateStocks: updateStocks,
};
