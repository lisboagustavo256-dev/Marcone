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

const fs = require("fs");

const config = require("./config.json");

client.once("ready", async () => {
    console.log("Marcone Online!");

    const canalRegras = client.channels.cache.get("1515078564842574064");

    if (!canalRegras) return;

    // Se já enviou, não manda novamente
    if (config.regrasEnviadas === true) {
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle("📜 Regras do Servidor")
        .setDescription(`
## 1. Respeito acima de tudo

Trate todos os membros com respeito. Ofensas, assédio, preconceito, discriminação ou perseguição não serão tolerados.

## 2. Sem spam ou flood

Não envie mensagens repetidas, excesso de emojis, menções desnecessárias ou divulgações sem autorização.

## 3. Conteúdo inadequado

É proibido enviar conteúdo +18, gore, material ilegal ou qualquer conteúdo que viole os Termos de Serviço do Discord.

## 4. Sem divulgação não autorizada

Não divulgue outros servidores, redes sociais, links ou projetos sem permissão da equipe.

## 5. Use os canais corretamente

Cada canal possui uma finalidade específica. Mantenha as conversas organizadas no local adequado.

## 6. Respeite a equipe

Moderadores e administradores estão aqui para manter a ordem. Caso discorde de alguma decisão, abra um ticket para conversar.

## 7. Proibido causar confusão

Provocações, brigas, discussões excessivas ou atitudes que prejudiquem o ambiente podem resultar em punição.

## 8. Nomes e fotos apropriados

Seu nome, foto de perfil e status não podem conter conteúdo ofensivo, preconceituoso ou inadequado.

## 9. Tickets

Abra tickets apenas quando necessário. Tickets sem motivo ou usados para brincadeiras poderão resultar em punição.

## 10. Bom senso

Nem toda situação está prevista nas regras. A equipe poderá agir quando necessário para manter o servidor organizado e agradável para todos.

:alertastaff2000:  O descumprimento das regras poderá resultar em advertência, mute, timeout, kick ou banimento, dependendo da gravidade da infração.
-# Equipe @🛠️ Administrador  Agradeçe. @here @everyone
        `)
        .setColor("Red");

    await canalRegras.send({
        embeds: [embed]
    });

    // salva que já enviou
    config.regrasEnviadas = true;

    fs.writeFileSync(
        "./config.json",
        JSON.stringify(config, null, 4)
    );

    console.log("Regras enviadas!");
});
