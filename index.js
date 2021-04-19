require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(TOKEN);

// ###############

// Обработчик начала диалога с ботом
bot.start((ctx) =>
  ctx.reply(
    `Привет ${
       ctx.from.first_name ? ctx.from.first_name : ")"
    }! /help пока не работает.`
  )
);

// Обработчик команды /help
bot.help((ctx) => ctx.reply(" No."));

// Обработчик команды /whoami
bot.command("whoami", (ctx) => {
  const { id, username, first_name, last_name } = ctx.from;
  return ctx.replyWithMarkdown(`Кто ты в телеграмме:
*id* : ${id}
*username* : ${username}
*Имя* : ${first_name}
*Фамилия* : ${last_name}
*chatId* : ${ctx.chat.id}`);
});

bot.command("cat", async (ctx) => {
  try {
    const pic = await fetch('https://aws.random.cat/meow');
    const data = await pic.json();
    ctx.replyWithPhoto(data.file);
  }
  catch(e) {
    ctx.reply('error');
  }
});

// Обработчик простого текста
bot.on("text", (ctx) => {
  return ctx.reply(ctx.message.text);
});


// Запуск бота
bot.launch();
