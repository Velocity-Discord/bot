const client = require("./client");
const { MessageEmbed } = require("discord.js");
const store = require("../../stores/tags.json");
const { writeFileSync } = require("fs");
const path = require("path");

module.exports = {
    config: {
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
        let content;
        switch (ctx.options.getSubcommand()) {
            case "get":
                content = store[name];
                if (content) {
                    const embed = new MessageEmbed({
                        title: name,
                        description: content,
                    });
                    await ctx.reply({ embeds: [embed] });
                } else {
                    await ctx.reply({ content: "Tag not Found", ephemeral: true });
                }
                break;
            case "create":
                if (!ctx.member.permissions.has("MANAGE_GUILD")) {
                    await ctx.reply({ content: "You do not have permission to create tags.", ephemeral: true });
                    break;
                }
                content = ctx.options.getString("content");
                store[name] = content;
                await ctx.reply({ content: "Tag Created." });
                writeFileSync(path.resolve(__dirname, "../../stores/tags.json"), JSON.stringify(store, null, 4));
                break;
        }
    },
};
