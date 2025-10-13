// telegram-bot.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createUserBot } = require('./whatsapp-handler');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => {
    ctx.reply(`👋 Hello ${ctx.from.first_name}!\n\nWelcome to *StackGPT WhatsApp Bot Deployer* ⚡\n\nSend your WhatsApp number in this format:\n📱 2348012345678\n\nWe'll send you a custom pairing code to connect your WhatsApp bot.`);
});

bot.on('text', async (ctx) => {
    const input = ctx.message.text.trim();
    if (!/^\d{11,15}$/.test(input)) {
        return ctx.reply('⚠️ Invalid format! Please send a valid number like *2348012345678*');
    }

    const userNumber = input;
    ctx.reply(`⏳ Please wait while we prepare your WhatsApp bot and generate your pairing code...`);

    await createUserBot(userNumber, ctx);
});

bot.launch();
console.log(chalk.cyan('🤖 StackGPT Telegram Bot is now running...'));
