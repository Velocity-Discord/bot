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
                name: "delete",
                description: "Delete an embed",
                type: 1,
                options: [
                    {
                        name: "name",
                        description: "The name of the embed",
                        type: 3,
                        autocomplete: true,
                        required: true,
                    },
                ],
            },
            {
                name: "create",
                description: "Create an embed",
                type: 1,
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
            {
                name: "edit",
                description: "Edit an embed",
                type: 1,
                options: [
                    {
                        name: "name",
                        description: "The name of the embed",
                        type: 3,
                        autocomplete: true,
                        required: true,
                    },
                    {
                        name: "content",
                        description: "The new content of the embed",
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
        }
    },
};
