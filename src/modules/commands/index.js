const client = require("./client");
const MENTION_RESPONSES = require("../responses/mentions");

module.exports = {
    ping: require("./ping"),
    guilds: require("./guilds"),
    tag: require("./tag"),
    post: require("./post"),
    eval: require("./eval"),
    polldata: require("./polldata"),
};

let TIMEOUT = null;

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (TIMEOUT) return;
    TIMEOUT = setTimeout(() => {
        TIMEOUT = null;
    }, 100);

    if (message.content.trim() == `<@${process.env.CLIENT_ID}>`) {
        message.reply("what, do i look like a slave to you?");
    } else if (message.content.trim().includes(`<@${process.env.CLIENT_ID}>`)) {
        const response = MENTION_RESPONSES[Math.floor(Math.random() * MENTION_RESPONSES.length)];
        message.reply(response);
    }

    const args = message.content.split(" ");
    const command = `${args.shift().replace(process.env.PREFIX, "").toLowerCase()}`;

    console.log(`Command: ${command}`);
    console.log(`Args: ${args}`);

    if (!message.content.startsWith(process.env.PREFIX)) return;

    if (module.exports[command]) {
        if (module.exports[command].config.internalCommandType !== "text") return;

        module.exports[command].exec(message, args.join(" "));
    }
});
