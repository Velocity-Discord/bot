const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const client = require("./modules/commands/client");

require("dotenv").config();

require("./modules/util/boards")();
const globalCommands = require("./modules/commands/slash");

console.log("\x1b[1;94mVelocity \x1b[0m");
console.log("Starting bot...");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log(`--------------------------------------------------------------------------------`);
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: globalCommands });

        console.log("Successfully reloaded application (/) commands.");
        console.log(`--------------------------------------------------------------------------------`);
    } catch (error) {
        console.error(error);
    }
})();

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}! Active on ${client.guilds.cache.size} servers.`);
});
client.login(process.env.TOKEN);
