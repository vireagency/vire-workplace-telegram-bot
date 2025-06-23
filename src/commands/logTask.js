module.exports = (bot) => {
  bot.command('logtask', async (ctx) => {
    await ctx.reply('📝 Please enter your task update:');
    bot.on('text', async (ctx) => {
      const task = ctx.message.text;
      await ctx.reply(`✅ Task recorded: "${task}"`);
    });
  });
};