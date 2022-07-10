const commands = require(".");
const client = require("./client");

module.exports = [require("./ping").config, require("./tag").config];

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.commandName;

    if (commands[command]) {
        const commandExec = commands[command].exec;
        await commandExec(interaction);
    }
});
