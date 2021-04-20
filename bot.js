require("dotenv").config();
const TOKEN = process.env.BOT_TOKEN;
const axios = require('axios').default;
const { Telegraf } = require("telegraf");
const bot = new Telegraf(TOKEN);

//////////////////////////////////////

const url = 'https://collectionapi.metmuseum.org/public/collection/v1/';
// ###############

let img, object;

bot.start((ctx) =>
  ctx.reply(
    `Привет ${
       ctx.from.first_name ? ctx.from.first_name : ")"
    }`
  )
);

// Обработчик команды /help
bot.help((ctx) => ctx.reply("Not yet"));

bot.on("text", async(ctx) => {
  console.log('text: ' + ctx.message.text);

  await getRandomID(ctx, ctx.message.text)
      // ctx.replyWithPhoto({ url: img }, { caption: 'Caption' })
  // await ctx.reply(img)
  // if (img) {
  // } else {
    // ctx.reply('error')
  // }
})


function getRandomID(ctx, query) {
  axios.get(url + 'search?hasImages=true&q=' + query)
  .then(res => {
    console.log('total: ' + res.data.total)
    console.log('objectIDs: ' + res.data.objectIDs)
    let random = Math.round(Math.random() * res.data.total)
    object = res.data.objectIDs[random];

    axios.get(url + 'objects/' + object)
    .then(res => {
      img = res.data.primaryImage
      console.log('img: ' + img)

      ctx.replyWithPhoto(img)
    })
      .catch(err => {
        console.log(err)
        ctx.reply('NOPE')
    })
  })
  .catch(err => {
    console.log(err)
    ctx.reply('NOPE')
  })
}

async function getImageUrl(obj) {
  await
    axios.get(url + 'objects/' + obj)
    .then(res => {
      img = res.data.primaryImageSmall
      console.log('img: ' + img)
    })
    .catch(err => {
      console.log(err)
    })
}

// Обработчик команды /whoami
// bot.command("whoami", (ctx) => {
//   const { id, username, first_name, last_name } = ctx.from;
//   return ctx.replyWithMarkdown(`Кто ты в телеграмме:
// *id* : ${id}
// *username* : ${username}
// *Имя* : ${first_name}
// *Фамилия* : ${last_name}
// *chatId* : ${ctx.chat.id}`);
// });

// bot.command("cat", async (ctx) => {
//   try {
//     const pic = await fetch('https://aws.random.cat/meow');
//     const data = await pic.json();
//     ctx.replyWithPhoto(data.file);
//   }
//   catch(e) {
//     ctx.reply('error');
//   }
// });

// Обработчик простого текста
// bot.on("text", async(ctx) => {
//   try {
//     const search = await fetch(url+'search?hasImages=true&q='+ctx.message.text);
//     const result = await search.json();
    
//     const total = await result.total;
//     const random = await Math.round(Math.random()*total);

//     const object = await fetch(url+'objects/'+random);
//     const res = await object.json();
//     // ctx.reply(result.total);
//     // ctx.reply(res.primaryImage);
//     ctx.replyWithPhoto(res.primaryImage);
//   }
//   catch(e) {
//     ctx.reply('error');
//   }
//   // return ctx.reply(ctx.message.text);
// });


// Запуск бота
bot.launch();
