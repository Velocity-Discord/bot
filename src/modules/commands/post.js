const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        internalCommandType: "text",
        name: "post",
        description: "Post stuff",
    },
    exec: async (message, arg) => {
        const channel = message.channel;
        const args = arg.split("|").map((e) => e.trim());

        if (args.length < 2) {
            channel.send("You need to provide at least 2 arguments.");
            return message.delete();
        }

        const embed = new MessageEmbed({
            title: args[0],
            description: args[1],
            color: "#5B89FD",
        });

        if (args[2] == "y") {
            embed.setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            });
        }

        return channel.send({ embeds: [embed] }).then(() => message.delete());
    },
};
