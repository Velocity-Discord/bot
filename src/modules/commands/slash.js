const commands = require("./");
const client = require("./client");

const commandConfigs = Object.values(commands).map((command) => command.config);

module.exports = Array.from(commandConfigs).filter((command) => command.internalCommandType === "slash");

client.on("interactionCreate", async (interaction) => {
    if (!(interaction.isCommand() || interaction.isAutocomplete())) return;

    const command = interaction.commandName;

    if (commands[command]) {
        if (commands[command].config.internalCommandType !== "slash") return;
        const commandExec = commands[command].exec;
        await commandExec(interaction);
    }
});
