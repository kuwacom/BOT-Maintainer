const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, Interaction } = require('discord.js');
const log4js = require('log4js');
const logger = log4js.getLogger("<LOG>");
logger.level = 'all';

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const botData = require('./botData.json');
const embedCollar = {
    info: "#87ceeb",
    success: "#00fa9a",
    warning: "#ffa500",
    error: "#ff0000"
}

const infoButton = [
    new MessageActionRow().addComponents(
        new MessageButton()
            // .setCustomId("contact")
            .setStyle("LINK")
            .setLabel("サポートサーバー")
            .setEmoji("<:kuwanetwork:1026933178855854090>")
            .setURL("https://kuwa.app/discord/support")
    ).addComponents(
        new MessageButton()
            // .setCustomId("contact")
            .setStyle("LINK")
            .setLabel("kuwa-networkステータス")
            .setEmoji("<:dot_green:983310089811292180>")
            .setURL("https://status.kuwa.app/")
    ),
    new MessageActionRow().addComponents(
        new MessageButton()
            // .setCustomId("contact")
            .setStyle("LINK")
            .setLabel("くわの家 コミュニティサーバー")
            .setEmoji("<:kuwa:1026933738963226654>")
            .setURL("https://kuwa.app/discord/support")
    ).addComponents(
        new MessageButton()
            // .setCustomId("contact")
            .setStyle("LINK")
            .setLabel("GitHub")
            .setEmoji("<:githublight120:1026933734894735370>")
            .setURL("https://kuwa.dev/github")
    )
]

// エラーハンドリング
process.on('uncaughtException', function (err) {
    logger.error(err)
});

botData.bots.forEach(async (bot, index) => {
    if (!bot.notic) return;
    const client = new Client({
        // intents: new Intents(32767),
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
        ws: { properties: { $browser: "Discord iOS" } }
    });
    const loggerBOT = log4js.getLogger(`<${bot.name}>`);
    loggerBOT.level = 'all';

    client.on("ready", async () => {
        loggerBOT.info("LOGIN TO DISCORD")
        client.user.setPresence({
            // status: "idle",
            activities: [{ name: "現在メンテナンス", type: "PLAYING" }]
        });
        loggerBOT.info("set BOTSTATUS")
    })

    client.on("messageCreate", async (message) => {
        console.log(message.content)
        loggerBOT.debug(message.content);
        // if (message.content.startsWith("!!km4") || message.content.startsWith("!!km3") || message.content.startsWith("!!km2") || message.content.startsWith("!!km1")) {
        if (botData.messageCommands.some(prefix => message.content.startsWith(prefix))) {
            bot = botData.bots[index]
            if (bot.switch) {
                message.reply({ embeds: [bot.message.button.embed], ephemeral: bot.message.button.ephemeral, components: infoButton })
                return
            }
            message.reply({ embeds: [botData.message.button.embed], ephemeral: botData.message.button.ephemeral, components: infoButton })
            return
        }
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isButton()) {
            bot = botData.bots[index]
            if (bot.switch) {
                interaction.reply({ embeds: [bot.message.button.embed], ephemeral: bot.message.button.ephemeral, components: infoButton })
                return
            }
            interaction.reply({ embeds: [botData.message.button.embed], ephemeral: botData.message.button.ephemeral, components: infoButton })
            return
        } else if (interaction.isSelectMenu()) {
            bot = botData.bots[index]
            if (bot.switch) {
                interaction.reply({ embeds: [bot.message.selectMenu.embed], ephemeral: bot.message.selectMenu.ephemeral, components: infoButton })
                return
            }
            interaction.reply({ embeds: [botData.message.selectMenu.embed], ephemeral: botData.message.selectMenu.ephemeral, components: infoButton })
            return
        } else if (interaction.isCommand()) {
            bot = botData.bots[index]
            if (bot.switch) {
                interaction.reply({ embeds: [bot.message.command.embed], ephemeral: bot.message.command.ephemeral, components: infoButton })
                return
            }
            interaction.reply({ embeds: [botData.message.command.embed], ephemeral: botData.message.command.ephemeral, components: infoButton })
            return
        }
    });
    client.login(bot.token);
});

