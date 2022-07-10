const client = require("./client");
const { MessageEmbed } = require("discord.js");
const store = require("../../stores/tags.json");
const { writeFileSync } = require("fs");
const path = require("path");

module.exports = {
    config: {
        internalCommandType: "slash",
        name: "tag",
        description: "Tags",
        options: [
            {
                name: "get",
                description: "Get the contents of a tag",
                type: 1,
                options: [
                    {
                        name: "name",
                        description: "The name of the tag",
                        type: 3,
                        autocomplete: true,
                        required: true,
                    },
                ],
            },
            {
                name: "delete",
                description: "Delete a tag",
                type: 1,
                options: [
                    {
                        name: "name",
                        description: "The name of the tag",
                        type: 3,
                        autocomplete: true,
                        required: true,
                    },
                ],
            },
            {
                name: "create",
                description: "Create a tag",
                type: 1,
                options: [
                    {
                        name: "name",
                        description: "The name of the tag",
                        type: 3,
                        required: true,
                    },
                    {
                        name: "content",
                        description: "The content of the tag",
                        type: 3,
                        required: true,
                    },
                ],
            },
        ],
    },
    exec: async (ctx) => {
        const name = ctx.options.getString("name");
        if (ctx.type == "APPLICATION_COMMAND_AUTOCOMPLETE") {
            const focusedValue = ctx.options.getFocused();
            const filtered = Object.keys(store).filter((choice) => choice.startsWith(focusedValue));
            await ctx.respond(filtered.map((choice) => ({ name: choice, value: choice })));
            return;
        }

        let embed;
        let content;
        switch (ctx.options.getSubcommand()) {
            case "get":
                content = store[name];
                if (content) {
                    embed = new MessageEmbed({
                        title: name,
                        description: content,
                        timestamp: Date.now(),
                        color: "#5B89FD",
                        footer: {},
                    });

                    await ctx.reply({ embeds: [embed] });
                } else {
                    embed = new MessageEmbed({
                        title: "Tag not found",
                        description: "The tag you are looking for does not exist",
                        timestamp: Date.now(),
                        color: "#ED4245",
                        footer: {},
                    });

                    await ctx.reply({ embeds: [embed], ephemeral: true });
                }
                break;
            case "create":
                if (!ctx.member.permissions.has("MANAGE_GUILD")) {
                    embed = new MessageEmbed({
                        title: "Missing Permission",
                        description: "You do not have permission to create tags.",
                        timestamp: Date.now(),
                        color: "#ED4245",
                        footer: {},
                    });

                    await ctx.reply({ embeds: [embed], ephemeral: true });
                    break;
                }
                content = ctx.options.getString("content");
                store[name] = content;
                embed = new MessageEmbed({
                    title: "Tag Created",
                    description: `The tag ${name} has been created`,
                    timestamp: Date.now(),
                    color: "#5B89FD",
                    footer: {},
                });

                await ctx.reply({ embeds: [embed] });
                writeFileSync(path.resolve(__dirname, "../../stores/tags.json"), JSON.stringify(store, null, 4));
                break;
            case "delete":
                if (!ctx.member.permissions.has("MANAGE_GUILD")) {
                    embed = new MessageEmbed({
                        title: "Missing Permission",
                        description: "You do not have permission to delete tags.",
                        timestamp: Date.now(),
                        color: "#ED4245",
                        footer: {},
                    });

                    await ctx.reply({ embeds: [embed], ephemeral: true });
                    break;
                }
                delete store[name];

                embed = new MessageEmbed({
                    title: "Tag Deleted",
                    description: `The tag ${name} has been deleted`,
                    timestamp: Date.now(),
                    color: "#5B89FD",
                    footer: {},
                });
                await ctx.reply({ content: "Tag Deleted" });
                writeFileSync(path.resolve(__dirname, "../../stores/tags.json"), JSON.stringify(store, null, 4));
        }
    },
};
