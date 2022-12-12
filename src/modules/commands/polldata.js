const client = require("./client");

module.exports = {
    config: {
        internalCommandType: "text",
        name: "polldata",
        description: "Gets data from a poll message",
    },
    exec: async (message) => {
        const isReply = message.type == "REPLY";

        if (!isReply) {
            return message.reply("This command can only be used in a **reply** to a poll message");
        }

        const pollMessage = await message.channel.messages.fetch(message.reference.messageId);

        const reactions = pollMessage.reactions.cache.sort((a, b) => b.count < a.count);

        let messageString = `
**${pollMessage.author.username}'s poll results**

`;

        reactions.forEach((reaction) => {
            const emoji = reaction.emoji.name;
            const count = reaction.count;

            messageString += `${emoji} - ${count}\n`;
        });

        if (reactions.size == 0) {
            messageString += "No reactions found or message not cached :(";
        }

        message.channel.send(messageString);
    },
};
