const { MessageEmbed } = require("discord.js");
const client = require("../commands/client");
const store = require("../../stores/boards.json");
const { writeFileSync } = require("fs");
const path = require("path");

module.exports = () => {
    const handle = async (reaction) => {
        const message = reaction.message;
        const channel = message.channel;
        const guild = channel.guild;

        const starboardChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() === "starboard");
        const skullboardChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() === "skullboard");

        const reactionCount = reaction.count;

        const embed = new MessageEmbed({
            author: {
                name: message.author?.tag,
                iconURL: message.author.displayAvatarURL(),
            },
            description: `${message.content}\n\n[Jump to Message](${message.url})`,
            timestamp: Date.now(),
            image: { url: message.attachments.first()?.proxyURL },
            color: reaction.emoji.name === "💀" ? "#CBD5DC" : "#FFAC32",
        });

        if (reaction.emoji.name === "⭐") {
            const messageInStore = store.starboard.find((msg) => msg.message === message.id);

            if (messageInStore) {
                const msg = await starboardChannel.messages.fetch(messageInStore.message);

                if (reactionCount > 2) {
                    return msg.edit({ embeds: [embed], content: `${reactionCount < 5 ? "⭐" : "🌟"} ${reactionCount} | <#${channel.id}>` });
                } else {
                    store.starboard.splice(store.starboard.indexOf(messageInStore), 1);
                    writeFileSync(path.resolve(__dirname, "../../stores/boards.json"), JSON.stringify(store, null, 4));
                    return msg.delete();
                }
            }

            if (reactionCount < 3) return;

            const msg = await starboardChannel.send({ embeds: [embed], content: `${reactionCount < 5 ? "⭐" : "🌟"} ${reactionCount} | <#${channel.id}>` });

            store.starboard.push({
                id: message.id,
                message: msg.id,
                channel: channel.id,
            });
        }

        if (reaction.emoji.name === "💀") {
            const messageInStore = store.skullboard.find((msg) => msg.message === message.id);

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

            store.skullboard.push({
                id: message.id,
                message: msg.id,
                channel: channel.id,
            });
        }
    };

    client.on("messageReactionAdd", handle);
    client.on("messageReactionRemove", handle);
};
