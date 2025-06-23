module.exports = (bot) => {
  bot.command('checkin', async (ctx) => {
    await ctx.reply('📍 Please share your location or type "Skip"');
    await ctx.reply('⏱️ What time did you arrive? (Format: HH:MM)');
    bot.on('text', async (ctx) => {
      const checkInTime = ctx.message.text;
      await ctx.reply(`✅ Great! You’re checked in at ${checkInTime}`);
    });
  });
};