// const bot = require('./src/bot');
// bot.launch();
// console.log('🚀 Vire Workplace Telegram Bot is running...');
// index.js
require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// In-memory session store (replace with DB later)
const sessions = {};

const getUserSession = (id) => {
  if (!sessions[id]) {
    sessions[id] = {
      flow: null,
      temp: {},
      logs: [],
    };
  }
  return sessions[id];
};

// Start
bot.start((ctx) => {
  ctx.reply(`Hi 👋🏽 ${ctx.from.first_name}, welcome to Vire Agency Bot.\n\nPlease choose an action:\n1️⃣ /checkin\n2️⃣ /checkout\n3️⃣ /logtask\n4️⃣ /viewtasks`);
});

// Checkin Command
bot.command('checkin', (ctx) => {
  const session = getUserSession(ctx.from.id);
  session.flow = 'checkin_location';
  ctx.reply('📍 Please enter your location or type "Skip"');
});

// Checkout Command
bot.command('checkout', (ctx) => {
  const session = getUserSession(ctx.from.id);
  session.flow = 'checkout_time';
  ctx.reply('🕔 What time are you closing today? (e.g., 6:30)');
});

// Log Task
bot.command('logtask', (ctx) => {
  const session = getUserSession(ctx.from.id);
  session.flow = 'log_task';
  ctx.reply('📝 Please enter your task update:');
});

// View Tasks
bot.command('viewtasks', (ctx) => {
  const session = getUserSession(ctx.from.id);
  const logs = session.logs;
  if (logs.length === 0) {
    ctx.reply('📋 No tasks or logs recorded today.');
    return;
  }

  let message = '📋 Here\'s what you\'ve logged today:\n';
  logs.forEach((log, index) => {
    message += `- ${log.time}: ${log.entry} ${log.icon}\n`;
  });
  ctx.reply(message);
});

// Handle all text inputs
bot.on('text', (ctx) => {
  const session = getUserSession(ctx.from.id);
  const text = ctx.message.text;

  // 🧭 Check-in Flow
  if (session.flow === 'checkin_location') {
    session.temp.location = text;
    session.flow = 'checkin_time';
    ctx.reply('⏱️ What time did you arrive? (Format: HH:MM)');
    return;
  }

  if (session.flow === 'checkin_time') {
    const location = session.temp.location;
    const time = text;
    session.logs.push({ time, entry: `Check-In at ${location}`, icon: '✅' });
    session.flow = null;
    session.temp = {};
    ctx.reply(`✅ Great! You’re checked in at ${time} from ${location}`);
    return;
  }

  // 🧭 Checkout Flow
  if (session.flow === 'checkout_time') {
    const time = text;
    session.logs.push({ time, entry: `Checked out`, icon: '📤' });
    session.flow = null;
    ctx.reply(`✅ Great! You’ve checked out at ${time}`);
    return;
  }

  // 🧭 Log Task Flow
  if (session.flow === 'log_task') {
    const time = new Date().toLocaleTimeString();
    session.logs.push({ time, entry: text, icon: '📝' });
    session.flow = null;
    ctx.reply(`✅ Task logged: "${text}"`);
    return;
  }

  // Default fallback
  ctx.reply('❓ I didn’t understand that. Use /checkin, /checkout, /logtask, or /viewtasks.');
});

// Launch the bot
bot.launch();
console.log('🤖 Bot is running...');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
