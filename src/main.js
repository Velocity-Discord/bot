const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const client = require("./modules/commands/client");

require("dotenv").config();

const globalCommands = require("./modules/commands/slash");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: globalCommands });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.TOKEN);
