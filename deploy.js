const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
    new SlashCommandBuilder()
        .setName("char")
        .setDescription("Mostra a skin Roblox")
        .addStringOption(option =>
            option
                .setName("nick")
                .setDescription("Nick Roblox")
                .setRequired(true)
        )
].map(command => command.toJSON());

const rest = new REST({ version: "10" })
    .setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registrando comandos...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("Comando /char registrado com sucesso!");
    } catch (error) {
        console.error(error);
    }
})();
