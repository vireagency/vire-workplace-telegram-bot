const { Telegraf } = require('telegraf');
require('dotenv').config();

const checkin = require('./commands/checkin');
const checkout = require('./commands/checkout');
const logTask = require('./commands/logTask');
const viewTasks = require('./commands/viewTasks');
const contactHR = require('./commands/contactHR');
const help = require('./commands/help');

const bot = new Telegraf(process.env.BOT_TOKEN);

checkin(bot);
checkout(bot);
logTask(bot);
viewTasks(bot);
contactHR(bot);
help(bot);

module.exports = bot;