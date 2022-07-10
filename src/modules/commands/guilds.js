const client = require("./client");

module.exports = {
    config: {
        internalCommandType: "text",
        name: "guilds",
        description: "Lists the guilds the bot is in.",
    },
    exec: async (message) => {
        const guilds = client.guilds.cache.map((g) => g.name).join("\n");

        message.channel.send(`
**Guilds**

${guilds}`);
    },
};
