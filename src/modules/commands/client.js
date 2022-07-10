const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS],
    presence: { activities: [{ name: "Discord", type: "WATCHING" }], status: "idle" },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

module.exports = client;
