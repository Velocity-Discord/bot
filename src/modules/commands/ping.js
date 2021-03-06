const client = require("./client");

module.exports = {
    config: {
        internalCommandType: "slash",
        name: "ping",
        description: "pong",
    },
    exec: async (ctx) => {
        await ctx.reply({ content: "Pinging...", fetchReply: true });
        ctx.editReply(`${client.ws.ping}ms`);
    },
};
