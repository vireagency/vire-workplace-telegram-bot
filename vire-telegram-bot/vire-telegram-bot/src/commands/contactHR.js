module.exports = (bot) => {
  bot.command('contacthr', async (ctx) => {
    await ctx.reply('💬 Please describe your concern. HR will be notified.');
    bot.on('text', async (ctx) => {
      const concern = ctx.message.text;
      await ctx.reply(`✅ Noted: "${concern}" — HR will get back to you.`);
    });
  });
};