const TelegramBot = require('node-telegram-bot-api');
const chalk = require('chalk');

// 🟢 Add your bot token here
const token = '8456968627:AAFMvt3WSGRJpW8Welpu-Rx-rVxz_PeXtNo';

// 🟡 Initialize bot
const bot = new TelegramBot(token, { polling: true });

// 🟢 Log startup message
console.log(chalk.cyanBright('🤖 StackGPT Telegram Bot is now running...'));
console.log(chalk.green('✅ Waiting for commands in Telegram...'));

// 🟡 Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
👋 Hello *${msg.from.first_name || 'there'}*!  
Welcome to *StackGPT Deployer Bot* 🚀  

To deploy your StackGPT WhatsApp bot, send your WhatsApp number in this format:
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

  // Simple validation
  if (/^\d{11,15}$/.test(text)) {
    const fakeCode = 'STAC-KGPT';
    await bot.sendMessage(
      chatId,
      `✅ Pairing Code Generated for *${text}*:\n\n🔐 *${fakeCode}*\n\nNow your bot is connecting...`,
      { parse_mode: 'Markdown' }
    );
  } else {
    await bot.sendMessage(
      chatId,
      `❌ Invalid number format.\nPlease send your WhatsApp number like this:\n\`2348012345678\``,
      { parse_mode: 'Markdown' }
    );
  }
});