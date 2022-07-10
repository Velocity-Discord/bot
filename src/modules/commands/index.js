const client = require("./client");
const MENTION_RESPONSES = require("../responses/mentions");

module.exports = {
    ping: require("./ping"),
};

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.trim() == `<@${process.env.CLIENT_ID}>`) {
        message.reply("what, do i look like a slave to you?");
    } else if (message.content.trim().includes(`<@${process.env.CLIENT_ID}>`)) {
        const response = MENTION_RESPONSES[Math.floor(Math.random() * MENTION_RESPONSES.length)];
        message.reply(response);
    }
});
