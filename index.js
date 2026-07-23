const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const noblox = require("noblox.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log(`Bot ${client.user.tag} online!`);
});

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "char") {

        const nick = interaction.options.getString("nick");

        try {

            const userId = await noblox.getIdFromUsername(nick);

            const avatar = await noblox.getPlayerThumbnail(
                userId,
                "420x420",
                "png",
                false,
                "body"
            );

            const embed = new EmbedBuilder()
                .setTitle(nick)
                .setImage(avatar[0].imageUrl)
                .setURL(`https://www.roblox.com/users/${userId}/profile`);

            await interaction.reply({
                embeds: [embed]
            });

        } catch {
            await interaction.reply("Usuário não encontrado.");
        }
    }
});

client.login(process.env.TOKEN);
