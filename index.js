const TelegramBot = require('node-telegram-bot-api'); 
const fs = require('fs');

// توکن ربات رو از فایل پیکربندی می‌خوانیم

const data = require('./config.json');

const Token = data.token;

console.log(Token);



// ایجاد ربات با polling

const bot = new TelegramBot(Token, { polling: true });



// دیکشنری برای ذخیره دستورات و پاسخ‌ها

const commandHandlers = {

  'نمونه کارها': () => 'من نمونه کارشم دیگ، دنبال چی میگردی؟ بدو بینم',

  'دریافت نرخ ارز': () => 'هنو را نیوفتاده',

};



let waitingForMessage = false; // متغیر برای بررسی اینکه آیا منتظر پیام هستیم یا نه



// زمانی که ربات استارت می‌خوره

bot.onText(/\/start/, (msg) => {

  const chatId = msg.chat.id;



  // ارسال پیام به چت آی‌دی مشخص بعد از استارت ربات

  const adminChatId = data.HesamChatId; // چت آی‌دی حسام

  const startMessage = `حاج حسام، یکی رباتو استارت کرد: @${msg.chat.username || msg.chat.first_name}`;



  // ارسال پیام به حسام

  bot.sendMessage(adminChatId, startMessage);



  // دکمه‌ها یا گزینه‌ها رو برای کاربر ارسال می‌کنیم

  const options = {

    reply_markup: {

      keyboard: [

        ['ارسال پیام به سلطان', 'نمونه کارها'],

        ['دریافت نرخ ارز']

      ],

      resize_keyboard: true,

      one_time_keyboard: true,

    }

  };



  bot.sendMessage(chatId, 'بهم میگن جمشید ارور دستیار حاج حسام، فرمایش ؟!', options);

});



// مدیریت پیام‌های ارسالی از طرف کاربر

bot.on('message', (msg) => {

  const chatId = msg.chat.id;

  const userMessage = msg.text;



  // اگر "ارسال پیام به سلطان" رو انتخاب کرده

  if (userMessage === 'ارسال پیام به سلطان') {

    bot.sendMessage(chatId, 'بنال نفله : (متن پیام)');

    waitingForMessage = true;  // حالا منتظر پیام کاربر هستیم

  } else if (waitingForMessage) {

    // اگر منتظر دریافت پیام هستیم، پیام رو می‌گیریم و برای حسام ارسال می‌کنیم

    const adminChatId = data.HesamChatId; // چت آی‌دی حسام

    const userName = msg.chat.username || msg.chat.first_name;

    const messageText = msg.text;



    // ارسال پیام به حسام

    bot.sendMessage(adminChatId, `حاج حسام یکی فرمایش داشته  \n \n ایدی  @${userName}: \n \n متن پیام : \n${messageText}`);



    // به کاربر تاییدیه می‌دهیم که پیامش ارسال شده

    bot.sendMessage(chatId, 'به عرضش رسوندم \n زت زیاد');



    // بازگشت به حالت اولیه

    waitingForMessage = false;

  } else if (commandHandlers[userMessage]) {

    // اگر پیام یکی از گزینه‌ها باشد، پاسخ مناسب را ارسال می‌کنیم

    bot.sendMessage(chatId, commandHandlers[userMessage]());

  } else if (userMessage !== '/start') {

    // در صورتی که پیام غیر از دستور start باشد و از گزینه‌ها نباشد

    bot.sendMessage(chatId, 'مشتی ، یکی از گزینه‌ها رو انتخاب کن');

  }

});



// مدیریت خطاها

bot.on("polling_error", (error) => {

  console.error("خطا در polling:", error);

});


const http = require('http');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running...\n');
}).listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


// گزارش روشن شدن ربات

console.log('جمشید ربات روشن شد!');
