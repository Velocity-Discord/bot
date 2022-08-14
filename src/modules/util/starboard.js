const { MessageEmbed } = require("discord.js");
const client = require("../commands/client");
const store = require("../../stores/starboard.json");
const { writeFileSync } = require("fs");
const path = require("path");

module.exports = () => {
    client.on("messageReactionAdd", async (reaction, user) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error("Something went wrong when fetching the message:", error);
                return;
            }
        }

        const message = reaction.message;
        const channel = message.channel;
        const guild = message.guild;

        const messageInStore = store.find((m) => m.id === message.id && m.channel === message.channel.id);

        if (reaction.emoji.name === "⭐") {
            const reactionCount = message.reactions.cache.get("⭐")?.count || 0;

            const starboardChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() === "starboard");

            const toSend = `${message.content}

[Jump to Message](${message.url})`;

            const embed = new MessageEmbed({
                author: {
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                },
                description: toSend,
                timestamp: Date.now(),
                image: {
                    url: message.attachments.first()?.proxyURL,
                },
                color: "#FFAC32",
            });

            if (messageInStore) {
                const starboardMessage = await starboardChannel.messages.fetch(messageInStore.message);

                if (reactionCount > 2) {
                    return starboardMessage.edit({ embeds: [embed], content: `⭐ ${reactionCount} | <#${channel.id}>` });
                } else {
                    store.splice(store.indexOf(messageInStore), 1);

                    writeFileSync(path.resolve(__dirname, "../../stores/starboard.json"), JSON.stringify(store, null, 4));
                    return starboardMessage.delete();
                }
            }

            if (reactionCount < 3) return;

            const starboardMessage = await starboardChannel.send({ embeds: [embed], content: `⭐ ${reactionCount} | <#${channel.id}>` });

            const storeItem = {
                id: message.id,
                channel: channel.id,
                message: starboardMessage.id,
            };

            store.push(storeItem);

            writeFileSync(path.resolve(__dirname, "../../stores/starboard.json"), JSON.stringify(store, null, 4));
        }
    });

    client.on("messageReactionRemove", async (reaction, user) => {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error("Something went wrong when fetching the message:", error);
                return;
            }
        }

        const message = reaction.message;
        const channel = message.channel;
        const guild = channel.guild;

        const messageInStore = store.find((m) => m.id === message.id && m.channel === message.channel.id);

        if (reaction.emoji.name === "⭐") {
            const reactionCount = message.reactions.cache.get("⭐")?.count || 0;

            const starboardChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() === "starboard" && channel.send);

            const toSend = `${message.content}

[Jump to Message](${message.url})`;

            const embed = new MessageEmbed({
                author: {
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                },
                description: toSend,
                timestamp: Date.now(),
                image: {
                    url: message.attachments.first()?.proxyURL,
                },
                color: "#FFAC32",
            });

            if (messageInStore) {
                const starboardMessage = await starboardChannel.messages.fetch(messageInStore.message);

                if (reactionCount > 2) {
                    return starboardMessage.edit({ embeds: [embed], content: `⭐ ${reactionCount} | <#${channel.id}>` });
                } else {
                    store.splice(store.indexOf(messageInStore), 1);

                    writeFileSync(path.resolve(__dirname, "../../stores/starboard.json"), JSON.stringify(store, null, 4));
                    return starboardMessage.delete();
                }
            }
        }
    });
};
