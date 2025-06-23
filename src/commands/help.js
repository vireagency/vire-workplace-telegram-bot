module.exports = (bot) => {
  bot.command('help', async (ctx) => {
    await ctx.reply(`📚 Available commands:\n/checkin\n/checkout\n/logtask\n/viewtasks\n/contacthr\n/help`);
  });
};