const client = require("./client");

module.exports = {
    config: {
        internalCommandType: "text",
        name: "eval",
        description: "Evaluates some code",
    },
    exec: async (message) => {
        if (message.author.id !== "538487970408300544") return message.reply("You're not allowed to use this command");

        const args = message.content.replace(/v\/eval[\s]*/, "");
        const code = args?.replace(/^[\s]*```(.*)?|```[\s]*$/g, "");

        if (!code) return message.reply("You need to provide some code");

        let evaled;
        let lang = "ts";

        if (code.includes("client.token")) return message.reply("ew no");

        try {
            let toSend = await Promise.resolve(
                eval(`
(async () => {
    ${code}
})()`)
            );

            if (typeof toSend == "object") {
                toSend = JSON.stringify(toSend);
                lang = "json";
            }
            evaled = toSend;
        } catch (err) {
            evaled = err;
        }

        if (evaled?.length > 2000) {
            return message.channel.send(`\`\`\`${lang}\n${evaled.substr(0, 1500)}\n\n...\n\`\`\``);
        }

        message.channel.send(`\`\`\`${lang}\n${evaled}\n\`\`\``);
    },
};
