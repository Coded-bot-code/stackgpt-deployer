// whatsapp-handler.js
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

async function createUserBot(userNumber, telegramCtx) {
    try {
        const sessionPath = path.join(__dirname, 'sessions', userNumber);
        if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const { version } = await fetchLatestBaileysVersion();

        const client = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            auth: state,
            browser: ['Chrome', 'Ubuntu', '1.0.0']
        });

        setTimeout(async () => {
            try {
                let code = await client.requestPairingCode(userNumber);
                const customCode = `STAC-KGPT`;
                console.log(chalk.green(`Pairing Code for ${userNumber}: ${customCode}`));
                telegramCtx.reply(`🤖 Your Pairing Code: \`${customCode}\`\n\n📲 Go to WhatsApp → Linked Devices → Pair with Code, and enter this code to connect.`)
                    .catch(() => {});
            } catch (err) {
                console.error(err);
                telegramCtx.reply(`❌ Error generating pairing code for ${userNumber}`);
            }
        }, 3000);

        client.ev.on('creds.update', saveCreds);

        client.ev.on('connection.update', async (update) => {
            const { connection } = update;
            if (connection === 'open') {
                console.log(chalk.blue(`✅ ${userNumber} connected to WhatsApp.`));
                telegramCtx.reply(`✅ Your WhatsApp bot is now connected and running! 🚀`);
                await client.sendMessage(`${userNumber}@s.whatsapp.net`, {
                    text: `🤖 *StackGPT WhatsApp Bot Connected Successfully!*\n\nWelcome ${userNumber}! Your bot is now active.`
                });
            } else if (connection === 'close') {
                console.log(chalk.red(`❌ ${userNumber} disconnected.`));
            }
        });
    } catch (err) {
        console.error('Error in createUserBot:', err);
        telegramCtx.reply('⚠️ Unexpected error while deploying your bot.');
    }
}

module.exports = { createUserBot };
