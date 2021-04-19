require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const fetch = require("node-fetch");
const { Telegraf } = require("telegraf");
const bot = new Telegraf(TOKEN);

const url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
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
bot.on("text", async(ctx) => {
  try {
    const search = await fetch(url+'search?hasImages=true&q='+ctx.message.text);
    const result = await search.json();
    
    const total = result.total;
    const random = Math.round(Math.random()*total);

    const object = await fetch(url+'objects/'+random);
    const res = await object.json();
    // ctx.reply(result.total);
    // ctx.reply(res.primaryImage);
    ctx.replyWithPhoto(res.primaryImage);
  }
  catch(e) {
    ctx.reply('error');
  }
  // return ctx.reply(ctx.message.text);
});


// Запуск бота
bot.launch();
