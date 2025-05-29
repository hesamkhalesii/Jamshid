const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');

// توکن ربات و اطلاعات دیگر رو از فایل config.json می‌گیریم
const data = require('./config.json');
const Token = data.token;
const port = 3000; // پورت مورد نظر
const app = express();

// ایجاد ربات با WebHook
const bot = new TelegramBot(Token, { webHook: true });

// تنظیم webhook
const url = data.webhookUrl; // مثلا https://yourdomain.com
bot.setWebHook(`${url}/bot${Token}`);

// مسیر دریافت پیام‌ها از تلگرام
app.use(express.json());
app.post(`/bot${Token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`سرور روی پورت ${port} گوش می‌دهد`);
});

// دیکشنری برای ذخیره دستورات و پاسخ‌ها
const commandHandlers = {
  'نمونه کارها': () => 'من نمونه کارشم دیگ، دنبال چی میگردی؟ بدو بینم',
  'دریافت نرخ ارز': () => 'هنو را نیوفتاده',
};

let waitingForMessage = false;

// زمانی که ربات استارت می‌خوره
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const adminChatId = data.HesamChatId;
  const startMessage = `حاج حسام، یکی رباتو استارت کرد: @${msg.chat.username || msg.chat.first_name}`;

  bot.sendMessage(adminChatId, startMessage);

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

// مدیریت پیام‌های کاربر
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  if (userMessage === 'ارسال پیام به سلطان') {
    bot.sendMessage(chatId, 'بنال نفله : (متن پیام)');
    waitingForMessage = true;
  } else if (waitingForMessage) {
    const adminChatId = data.HesamChatId;
    const userName = msg.chat.username || msg.chat.first_name;
    const messageText = msg.text;

    bot.sendMessage(adminChatId, `حاج حسام یکی فرمایش داشته  \n \n ایدی  @${userName}: \n \n متن پیام : \n${messageText}`);
    bot.sendMessage(chatId, 'به عرضش رسوندم \n زت زیاد');

    waitingForMessage = false;
  } else if (commandHandlers[userMessage]) {
    bot.sendMessage(chatId, commandHandlers[userMessage]());
  } else if (userMessage !== '/start') {
    bot.sendMessage(chatId, 'مشتی ، یکی از گزینه‌ها رو انتخاب کن');
  }
});

// مدیریت خطاها
bot.on("polling_error", (error) => {
  console.error("خطا در polling:", error);
});

console.log('جمشید ربات روشن شد!');
