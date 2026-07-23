const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log("Marcone Online!");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "char") {
        const nick = interaction.options.getString("nick");

        try {
            // avisa o Discord que o bot está processando
            await interaction.deferReply();

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
                return interaction.editReply("❌ Usuário não encontrado.");
            }

            const userId = data.data[0].id;
            const username = data.data[0].name;

            const thumbResponse = await fetch(
                `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`
            );

            const thumbData = await thumbResponse.json();

            const imageUrl = thumbData.data[0].imageUrl;

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`🎮 Skin de ${username}`)
                .setImage(imageUrl)
                .setURL(`https://www.roblox.com/users/${userId}/profile`)
                .setFooter({
                    text: "Marcone Roblox"
                });

            await interaction.editReply({
                embeds: [embed]
            });

        } catch (err) {
            console.error(err);

            if (interaction.deferred) {
                await interaction.editReply("❌ Erro ao buscar o jogador.");
            } else {
                await interaction.reply("❌ Erro ao buscar o jogador.");
            }
        }
    }
});

client.login(process.env.TOKEN);
