const { MessageEmbed } = require("discord.js");
const client = require("../commands/client");
const store = require("../../stores/boards.json");
const { writeFileSync } = require("fs");
const path = require("path");

module.exports = () => {
    client.on("messageReactionAdd", async (reaction, user) => async () => await handleReactions(reaction));
    client.on("messageReactionRemove", async (reaction, user) => async () => await handleReactions(reaction));

    async function handleReactions(reaction) {
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

        const embed = new MessageEmbed({
            author: {
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL(),
            },
            description: `${message.content}\n\n[Jump to Message](${message.url})`,
            timestamp: Date.now(),
            image: { url: message.attachments.first()?.proxyURL },
            color: reaction.emoji.name === "💀" ? "#CBD5DC" : "#FFAC32",
        });

        if (reaction.emoji.name === "⭐") {
            const reactionCount = message.reactions.cache.get("⭐")?.count || 0;
            const starboardChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() === "starboard");
            const messageInStore = store.starboard.find((m) => m.id === message.id && m.channel === message.channel.id);
            if (messageInStore) {
                const msg = await starboardChannel.messages.fetch(messageInStore.message);
                if (reactionCount > 2) {
                    return msg.edit({ embeds: [embed], content: `⭐ ${reactionCount} | <#${channel.id}>` });
                } else {
                    store.starboard.splice(store.starboard.indexOf(messageInStore), 1);
                    writeFileSync(path.resolve(__dirname, "../../stores/boards.json"), JSON.stringify(store, null, 4));
                    return msg.delete();
                }
            }
            if (reactionCount < 3) return;
            const msg = await starboardChannel.send({ embeds: [embed], content: `⭐ ${reactionCount} | <#${channel.id}>` });
            store.starboard.push({ id: message.id, channel: message.channel.id, message: msg.id });
        } else if (reaction.emoji.name === "💀") {
            const reactionCount = message.reactions.cache.get("💀")?.count || 0;
            const skullboardChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() === "skullboard");
            const messageInStore = store.skullboard.find((m) => m.id === message.id && m.channel === message.channel.id);
            if (messageInStore) {
                const msg = await skullboardChannel.messages.fetch(messageInStore.message);
                if (reactionCount > 2) {
                    return msg.edit({ embeds: [embed], content: `💀 ${reactionCount} | <#${channel.id}>` });
                } else {
                    store.skullboard.splice(store.skullboard.indexOf(messageInStore), 1);
                    writeFileSync(path.resolve(__dirname, "../../stores/boards.json"), JSON.stringify(store, null, 4));
                    return msg.delete();
                }
            }
            if (reactionCount < 3) return;
            const msg = await skullboardChannel.send({ embeds: [embed], content: `💀 ${reactionCount} | <#${channel.id}>` });
            store.skullboard.push({ id: message.id, channel: message.channel.id, message: msg.id });
        }
        writeFileSync(path.resolve(__dirname, "../../stores/boards.json"), JSON.stringify(store, null, 4));
    }
};
