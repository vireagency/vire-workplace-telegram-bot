module.exports = (bot) => {
  bot.command('checkout', async (ctx) => {
    await ctx.reply('🕔 What time are you closing today?');
    bot.on('text', async (ctx) => {
      await ctx.reply('📄 Would you like to submit a summary of your day? (Yes/No)');
    });
  });
};