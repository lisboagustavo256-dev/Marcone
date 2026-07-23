const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log("Marcone Online!");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "skin") {
        const nick = interaction.options.getString("nick");

        try {
            const response = await fetch(
                "https://users.roblox.com/v1/usernames/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usernames: [nick],
                        excludeBannedUsers: false
                    })
                }
            );

            const data = await response.json();

            if (!data.data || !data.data.length) {
                return interaction.reply("Usuário não encontrado.");
            }

            const userId = data.data[0].id;

            const thumbResponse = await fetch(
                `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`
            );

            const thumbData = await thumbResponse.json();

            const imageUrl = thumbData.data[0].imageUrl;

            const embed = new EmbedBuilder()
                .setTitle(nick)
                .setImage(imageUrl)
                .setURL(`https://www.roblox.com/users/${userId}/profile`);

            await interaction.reply({
                embeds: [embed]
            });

        } catch (err) {
            console.error(err);
            await interaction.reply("Erro ao buscar o jogador.");
        }
    }
});

client.login(process.env.TOKEN);
