const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Events,
  GetwayIntentBits,
  GatewayIntentBits,
  Collection,
} = require("discord.js");
const { apiKey, token } = require("./config.json");
const axios = require("axios");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const updateStocks = () => {
  let stockInfo = JSON.parse(
    fs.readFileSync("DB/stockInfo.json", { encoding: "utf-8" })
  );

  Object.keys(stockInfo).forEach((key) => {
    if (key == "update") return;
    const apiLink = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${key}&interval=1min&apikey=${apiKey}`;
    axios.get(apiLink).then((res) => {
      const data = res.data;
      const core =
        data["Time Series (1min)"][Object.keys(data["Time Series (1min)"])[0]];
      const price = core["4. close"];

      stockInfo[key] = price;

      fs.writeFileSync("DB/stockInfo.json", JSON.stringify(stockInfo), {
        encoding: "utf-8",
      });
    });
  });

  const date = new Date().toISOString().substring(0, 10);
  stockInfo.update = date;
  fs.writeFileSync("DB/stockInfo.json", JSON.stringify(stockInfo), {
    encoding: "utf-8",
  });
};

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  updateStocks();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }

  // console.log(interaction);
});

client.login(token);
