// // const bot = require('./src/bot');
// // bot.launch();
// // console.log('🚀 Vire Workplace Telegram Bot is running...');
// // index.js
// require('dotenv').config();
// const { Telegraf } = require('telegraf');
//
//
// const bot = new Telegraf(process.env.BOT_TOKEN);
//
// // In-memory session store (replace with DB later)
// const sessions = {};
//
// const getUserSession = (id) => {
//   if (!sessions[id]) {
//     sessions[id] = {
//       flow: null,
//       temp: {},
//       logs: [],
//     };
//   }
//   return sessions[id];
// };
//
// //Start
// bot.start((ctx) => {
//   ctx.reply(`Hi 👋🏽 ${ctx.from.first_name}, welcome to Vire Agency Bot.\n\nPlease choose an action:\n1️⃣ /checkin\n2️⃣ /checkout\n3️⃣ /logtask\n4️⃣ /viewtasks\n, /viewlogs\n, /contacthr\n, contactoperations\n, /help\n`);
// });
//
//
// // Checkin Command
// //Improve: Add a function to make sure checkins are within 8 hours of work day, 9:00am - 4:30pm
// //Don't ask them to enter the time they came, when they select check-in determine it by system time and tell them, and in the future we will send this to the db
// bot.command('checkin', (ctx) => {
//   const session = getUserSession(ctx.from.id);
//   session.flow = 'checkin_location';
//   ctx.reply('🕔 What time are you starting work today?  (e.g., 8:30am)');
// });
//
// // Checkout Command
// // Improve: Add a function to make sure checkouts are within 8 hours of work day, 9:00am - 5:00pm
// bot.command('checkout', (ctx) => {
//   const session = getUserSession(ctx.from.id);
//   session.flow = 'checkout_time';
//   ctx.reply('🕔 What time are you closing today? (e.g., 6:30am)');
// });
//
// // Log Task
// bot.command('logtask', (ctx) => {
//   const session = getUserSession(ctx.from.id);
//   session.flow = 'log_task';
//   ctx.reply('📝 Please enter your task update for today:');
// });
//
// // View Tasks is different from view logs,
// //View Tasks is tasks each person is assigned from managers for that day or week they can see, it will be fetched from db
// bot.command('viewtasks', (ctx) => {
//   const session = getUserSession(ctx.from.id);
//   const logs = session.logs;
//   if (logs.length === 0) {
//     ctx.reply('📋 No tasks or logs recorded today.');
//     return;
//   }
//
//   let message = '📋 Here\'s what you\'ve logged today:\n';
//   logs.forEach((log, index) => {
//     message += `- ${log.time}: ${log.entry} ${log.icon}\n`;
//   });
//   ctx.reply(message);
// });
//
//
// // Contact HR
// bot.command('contacthr', (ctx) => {
//   const session = getUserSession(ctx.from.id);
//   session.flow = 'contact_hr';
//   ctx.reply('📨 Please describe your concern. HR will be notified.');
// });
//
// // Help
// bot.command('help', (ctx) => {
//   ctx.reply(`
// 🆘 Available Commands:
// 1️⃣ /checkin – Log start of workday
// 2️⃣ /checkout – Log end of workday
// 3️⃣ /logtask – Submit a task update
// 4️⃣ /viewtasks – See your logs
// 5️⃣ /contacthr – Message HR
// 6️⃣ /help – Show this help menu
//   `);
// });
//
// // Handle all text inputs by text handler
// bot.on('text', (ctx) => {
//   const session = getUserSession(ctx.from.id);
//   const text = ctx.message.text;
//
//   // 🧭 Check-in Flow
//   // We are comparing the entered time with the current time(system time) to make sure the user is not checking in late
//   //We let them choose where they are working from that day, for location verification, the office has a gps we will compare their location to so see if it is true or not.
//   if (session.flow === 'checkin_location') {
//     const normalizedLocation = text.toLowerCase().trim();
//
//     if (normalizedLocation !== 'home' && normalizedLocation !== 'office') {
//       ctx.reply('❌ Invalid location. Please enter either "home" (remote) or "office" (in-person)');
//       return;
//     }
//
//     const locationDisplay = normalizedLocation === 'home' ? 'remote' : 'in-person';
//     session.temp.location = locationDisplay;
//     session.flow = 'checkin_time';
//     ctx.reply('⏱️ What time did you arrive? (Format: HH:MM)');
//     return;
//   }
//
//   if (session.flow === 'checkin_time') {
//     const location = session.temp.location;
//     const time = text;
//     session.logs.push({ time, entry: `Check-In (${location})`, icon: location === 'remote' ? '🏠' : '🏢' });
//     session.flow = null;
//     session.temp = {};
//     ctx.reply(`✅ Great! You're checked in at ${time} (${location})`);
//     return;
//   }
//
//   // 🧭 Checkout Flow
//   if (session.flow === 'checkout_time') {
//     const time = text;
//     session.logs.push({ time, entry: `Checked out`, icon: '📤' });
//     session.flow = null;
//     ctx.reply(`✅ Great! You’ve checked out at ${time}`);
//     return;
//   }
//
//   // 🧭 Log Task Flow
//   if (session.flow === 'log_task') {
//     const time = new Date().toLocaleTimeString();
//     session.logs.push({ time, entry: text, icon: '📝' });
//     session.flow = null;
//     ctx.reply(`✅ Task logged: "${text}"`);
//     return;
//   }
//
//   // Contact HR flow
//   if (session.flow === 'contact_hr') {
//     const time = new Date().toLocaleTimeString();
//     session.logs.push({ time, entry: `HR Message: ${text}`, icon: '📨' });
//     session.flow = null;
//     ctx.reply('✅ Message sent to HR. They’ll get back to you soon.');
//     return;
//   }
//
//   // Default fallback
//   ctx.reply('❓ I didn’t understand that. Use /checkin, /checkout, /logtask, /viewtasks, or /contacthr.');
// });
//
// // Launch the bot
// bot.launch();
// console.log('🤖 Vireworkplace Bot is running...');
//
//
// // Set the command menu for all users
// bot.telegram.setMyCommands([
//   { command: 'checkin', description: 'Check in for the day' },
//   { command: 'checkout', description: 'Check out for the day' },
//   { command: 'logtask', description: 'Log your task' },
//   { command: 'viewtasks', description: 'View today\'s tasks' },
//   { command: 'contacthr', description: 'Send a message to HR' },
//   { command: 'help', description: 'Get help and usage guide' }
// ]);
//
//
// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));


require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Vire GPS Location
const OFFICE_LOCATION = { lat: 5.6197, lon: -0.2321 };

// In-memory session
const sessions = {};

function getUserSession(id) {
    if (!sessions[id]) {
        sessions[id] = {
            flow: null,
            temp: {},
            logs: [],
        };
    }
    return sessions[id];
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentHour() {
    return new Date().getHours();
}

function isOvertime() {
    return getCurrentHour() > 17;
}

async function getCoordinatesFromLocationName(locationName) {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationName)}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results.length === 0) return null;

        return {
            lat: data.results[0].geometry.lat,
            lon: data.results[0].geometry.lng,
        };
    } catch (err) {
        return null;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
}

// --- Start ---
bot.start((ctx) => {
    ctx.reply(`👋🏽 Welcome ${ctx.from.first_name} to Vire Workplace Bot.

Use the menu or commands below:
✅ /checkin
✅ /checkout
✅ /logtask
✅ /viewtasks
✅ /viewlogs
✅ /contacthr
✅ /contactoperations
✅ /help`);
});

// --- Checkin ---
bot.command('checkin', (ctx) => {
    const session = getUserSession(ctx.from.id);
    session.flow = 'checkin_location';
    ctx.reply('📍 Are you working from "home" or "office" today?');
});

// --- Checkout ---
bot.command('checkout', (ctx) => {
    const session = getUserSession(ctx.from.id);

    const time = getCurrentTime();
    const overtime = isOvertime();
    const icon = overtime ? '⏰' : '📤';

    session.logs.push({ time, entry: overtime ? 'Checked out (Overtime)' : 'Checked out', icon });
    session.flow = null;

    ctx.reply(`✅ You’ve checked out at ${time}${overtime ? ' (Overtime)' : ''}`);
});

// --- Log Task ---
bot.command('logtask', (ctx) => {
    const session = getUserSession(ctx.from.id);
    session.flow = 'log_task';
    ctx.reply('📝 Enter your task update:');
});

// --- View Tasks (Mock data) ---
bot.command('viewtasks', (ctx) => {
    const tasks = [
        '🗂️ Finalize onboarding flow',
        '📊 Submit weekly performance report',
        '🎨 Review homepage redesign',
    ];
    ctx.reply(`📋 Tasks assigned to you:\n${tasks.map(t => `- ${t}`).join('\n')}`);
});

// --- View Logs ---
bot.command('viewlogs', (ctx) => {
    const session = getUserSession(ctx.from.id);
    if (!session.logs.length) {
        ctx.reply('📋 No logs recorded today.');
        return;
    }

    const message = session.logs.map(log => `- ${log.time}: ${log.entry} ${log.icon}`).join('\n');
    ctx.reply(`📋 Here’s your activity log today:\n${message}`);
});

// --- Contact HR ---
bot.command('contacthr', (ctx) => {
    const session = getUserSession(ctx.from.id);
    session.flow = 'contact_hr';
    ctx.reply('📩 Please type your message to HR:');
});

// --- Contact Operations ---
bot.command('contactoperations', (ctx) => {
    const session = getUserSession(ctx.from.id);
    session.flow = 'contact_ops';
    ctx.reply('🛠️ Please type your message to Operations:');
});

// --- Help ---
bot.command('help', (ctx) => {
    ctx.reply(`📌 Commands:
- /checkin – Log in for the day
- /checkout – End your day
- /logtask – Log your task progress
- /viewtasks – See your assigned tasks
- /viewlogs – View your daily logs
- /contacthr – Message HR
- /contactoperations – Message Operations
- /help – Show help menu`);
});

// --- Handle all text input ---
bot.on('text', async (ctx) => {
    const session = getUserSession(ctx.from.id);
    const input = ctx.message.text.trim();

    switch (session.flow) {
        case 'checkin_location':
            if (input !== 'home' && input !== 'office') {
                ctx.reply('❌ Invalid entry. Please type "home" or "office".');
                return;
            }

            session.temp.location = input;
            session.flow = input === 'office' ? 'checkin_verify_location' : null;

            if (input === 'home') {
                const time = getCurrentTime();
                session.logs.push({ time, entry: 'Check-In (Remote)', icon: '🏠' });
                ctx.reply(`✅ You’re checked in at ${time} (Remote 🏠)`);
            } else {
                ctx.reply('📍 Please type your current area or neighborhood (e.g., "East Legon, Accra")');
            }
            break;

        case 'checkin_verify_location':
            ctx.reply('📡 Verifying your location...');
            const coordinates = await getCoordinatesFromLocationName(input);
            if (!coordinates) {
                ctx.reply('❌ Could not find your location. Please enter a known place.');
                session.flow = null;
                return;
            }

            const distance = calculateDistance(coordinates.lat, coordinates.lon, OFFICE_LOCATION.lat, OFFICE_LOCATION.lon);
            const isInOffice = distance < 0.02;

            const time = getCurrentTime();
            session.logs.push({
                time,
                entry: `Check-In (${isInOffice ? 'Office' : 'Location Mismatch'})`,
                icon: isInOffice ? '🏢' : '❌',
            });

            ctx.reply(
                isInOffice
                    ? `✅ You're checked in at ${time} (Office 🏢)`
                    : `⚠️ You're NOT at the office. Checked in anyway at ${time} (⚠️ Mismatch)`
            );

            session.flow = null;
            break;

        case 'log_task':
            const logTime = getCurrentTime();
            session.logs.push({ time: logTime, entry: input, icon: '📝' });
            ctx.reply(`✅ Task logged: "${input}"`);
            session.flow = null;
            break;

        case 'contact_hr':
            session.logs.push({ time: getCurrentTime(), entry: `HR Message: ${input}`, icon: '📨' });
            ctx.reply('✅ HR has been notified. Mr. Amoateng will get back to you soon.');
            session.flow = null;
            break;

        case 'contact_ops':
            session.logs.push({ time: getCurrentTime(), entry: `Operations Message: ${input}`, icon: '📦' });
            ctx.reply('✅ Operations has been notified. Mr. Michael will get back to you soon.');
            session.flow = null;
            break;

        default:
            ctx.reply('🤖 Unknown input. Use /help or the command menu.');
    }
});

// --- Set command menu ---
bot.telegram.setMyCommands([
    { command: 'checkin', description: 'Check in for the day' },
    { command: 'checkout', description: 'Check out for the day' },
    { command: 'logtask', description: 'Log your task' },
    { command: 'viewtasks', description: 'See assigned tasks' },
    { command: 'viewlogs', description: 'See your daily logs' },
    { command: 'contacthr', description: 'Message HR' },
    { command: 'contactoperations', description: 'Message Operations' },
    { command: 'help', description: 'Help menu' }
]);

// --- Launch the bot ---
bot.launch();
console.log('🤖 Vire Workplace Bot is LIVE.');

// --- Graceful shutdown ---
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
