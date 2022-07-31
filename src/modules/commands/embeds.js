const client = require("./client");
const { MessageEmbed } = require("discord.js");
const store = require("../../stores/embeds.json");
const { writeFileSync } = require("fs");
const path = require("path");

module.exports = {
    config: {
        internalCommandType: "slash",
        name: "embed",
        description: "Embeds an stuff",
        options: [
            {
                name: "channel",
                description: "The channel to create the embed in",
                type: 7,
                required: true,
            },
            {
                name: "name",
                description: "The name of the embed",
                type: 3,
                required: true,
            },
            {
                name: "content",
                description: "The content of the embed",
                type: 3,
                required: true,
            },
        ],
    },
    exec: async (ctx) => {
        const Permission = ctx.member.hasPermission("MANAGE_MESSAGES");
        if (!Permission) return ctx.reply("You're not allowed to use this command");

        const channel = ctx.options.getChannel("channel");

        const embed = new MessageEmbed({
            title: ctx.options.getString("name"),
            description: ctx.options.getString("content"),
            color: 0x6584ee,
            author: {
                name: "Velocity",
                iconURL: client.user.avatarURL(),
            },
            footer: {
                text: `Created by ${ctx.author.tag}`,
                iconURL: ctx.author.avatarURL(),
            },
        });

        await channel.send(embed);

        ctx.reply("Embed created");
    },
};
