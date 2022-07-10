const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents } = require("discord.js");
require("dotenv").config();

const MENTION_RESPONSES = require("./modules/responses/mentions");

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
];

const CLIENT_ID = "995494958347849879";

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}! Connected to ${client.ws.socket}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
        interaction.editReply(`${client.ws.ping}ms`);
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.trim() == "<@995494958347849879>") {
        message.reply("what, do i look like a slave to you?");
    } else if (message.content.trim().includes("<@995494958347849879>")) {
        const response = MENTION_RESPONSES[Math.floor(Math.random() * MENTION_RESPONSES.length)];
        message.reply(response);
    }
});

client.login(process.env.TOKEN);
