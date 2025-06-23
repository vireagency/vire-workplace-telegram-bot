module.exports = (bot) => {
  bot.command('viewtasks', async (ctx) => {
    await ctx.reply(`📋 Here's what you've logged today:\n- 9:00 AM: Check-In ✅\n- 11:00 AM: Drafted marketing email 📨\n- 2:00 PM: Team review call 📞`);
  });
};