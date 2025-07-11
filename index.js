// const bot = require('./src/bot');
// bot.launch();
// console.log('🚀 Vire Workplace Telegram Bot is running...');
// index.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const { markup } = require('telegraf');

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

// // Start
bot.start((ctx) => {
  ctx.reply(`Hi 👋🏽 ${ctx.from.first_name}, welcome to Vire Agency Bot.\n\nPlease choose an action:\n1️⃣ /checkin\n2️⃣ /checkout\n3️⃣ /logtask\n4️⃣ /viewtasks`);
});

//Keyboard Menu to start
// bot.start((ctx) => {
//   ctx.reply(
//       `Hi 👋🏽 ${ctx.from.first_name}, welcome to Vire Agency Bot.\n\nPlease Choose an action:`,
//       Markup.keyboard([
//         ['/checkin', '/checkout'],
//         ['/logtask', '/viewtasks'],
//         ['/contacthr', '/help']
//       ])
//           .resize()
//           .oneTime()
//   );
// });

// Checkin Command
bot.command('checkin', (ctx) => {
  const session = getUserSession(ctx.from.id);
  session.flow = 'checkin_location';
  ctx.reply('🕔 What time are you starting work today?  (e.g., 8:30)');
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
  ctx.reply('📝 Please enter your task update for today:');
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


// Contact HR
bot.command('contacthr', (ctx) => {
  const session = getUserSession(ctx.from.id);
  session.flow = 'contact_hr';
  ctx.reply('📨 Please describe your concern. HR will be notified.');
});

// Help
bot.command('help', (ctx) => {
  ctx.reply(`
🆘 Available Commands:
1️⃣ /checkin – Log start of workday  
2️⃣ /checkout – Log end of workday  
3️⃣ /logtask – Submit a task update  
4️⃣ /viewtasks – See your logs  
5️⃣ /contacthr – Message HR  
6️⃣ /help – Show this help menu
  `);
});

// Handle all text inputs by text handler
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

  // Contact HR flow
  if (session.flow === 'contact_hr') {
    const time = new Date().toLocaleTimeString();
    session.logs.push({ time, entry: `HR Message: ${text}`, icon: '📨' });
    session.flow = null;
    ctx.reply('✅ Message sent to HR. They’ll get back to you soon.');
    return;
  }

  // Default fallback
  ctx.reply('❓ I didn’t understand that. Use /checkin, /checkout, /logtask, /viewtasks, or /contacthr.');
});

// Launch the bot
bot.launch();
console.log('🤖 Vireworkplace Bot is running...');


// Set the command menu for all users
bot.telegram.setMyCommands([
  { command: 'checkin', description: 'Check in for the day' },
  { command: 'checkout', description: 'Check out for the day' },
  { command: 'logtask', description: 'Log your task' },
  { command: 'viewtasks', description: 'View today\'s tasks' },
  { command: 'contacthr', description: 'Send a message to HR' },
  { command: 'help', description: 'Get help and usage guide' }
]);


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
