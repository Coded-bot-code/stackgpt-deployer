const TelegramBot = require('node-telegram-bot-api');
const chalk = require('chalk');
const axios = require('axios');

// 🟢 Replace with your Telegram bot token
const token = '8371160359:AAGtJ9Mlz_TEeUImD5YzxG0RD9KZfCWF-oE';

// 🟢 Replace this with your WhatsApp number (the bot owner)
const ownerNumber = '2348029214393@s.whatsapp.net';

// 🟢 Initialize bot
const bot = new TelegramBot(token, { polling: true });

console.log(chalk.cyanBright('🤖 StackGPT Telegram Bot is now running...'));
console.log(chalk.green('✅ Waiting for commands in Telegram...'));

// 🟡 Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
👋 Hello *${msg.from.first_name || 'there'}*!  
Welcome to TruvaGPT Deployer Bot 🚀  

To deploy your TruvaGPT WhatsApp bot, send your WhatsApp number in this format:
\`2348012345678\` (without + or spaces)

I'll generate your pairing code automatically 🔑
  `;
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// 🟢 Handle phone number messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  // Ignore /start since it's handled above
  if (text.startsWith('/start')) return;

  // Simple phone validation
  if (/^\d{11,15}$/.test(text)) {
    const fakeCode = '`TRUV-AGPT`'; // 👈 copy-pasteable Markdown format

    // 📩 Send pairing code to Telegram user
    await bot.sendMessage(
      chatId,
      `✅ Pairing Code Generated for *${text}*:\n\n🔐 Copy this code and paste it into your WhatsApp bot:\n\n${fakeCode}\n\n⚙️ Connecting your bot... Please wait.`,
      { parse_mode: 'Markdown' }
    );

    // 📤 Notify WhatsApp owner (you)
    try {
      await axios.post('http://localhost:5000/sendMessage', {
        jid: ownerNumber,
        message: `📢 *New Pairing Request*\n\n👤 Telegram User: ${msg.from.first_name}\n📞 WhatsApp Number: ${text}\n🔑 Code: TRUV-AGPT\n\n✅ Tell the user to enter this code in their bot now.`
      });

      console.log(chalk.yellow(`📩 Notification sent to WhatsApp for ${text}`));
    } catch (err) {
      console.log(chalk.red('⚠️ Failed to notify WhatsApp. Make sure your WhatsApp bot API is running.'));
    }
  } else {
    await bot.sendMessage(
      chatId,
      `❌ Invalid number format.\nPlease send your WhatsApp number like this:\n\`2348012345678\``,
      { parse_mode: 'Markdown' }
    );
  }
});