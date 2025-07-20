const { Telegraf } = require("telegraf");
const { MakeAdmin, AllAdmins } = require("../database/Request/Users");
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.on("text", async (ctx) => {
  const inputText = ctx.message.text;
  const secret = process.env.SECRET_TEXT;

  if (inputText !== secret) {
    return ctx.reply("🔒 Неизвестный текст. Доступ запрещён.");
  }

  try {
    const { id, first_name } = ctx.from;
    const newAdmin = await MakeAdmin(id, first_name);
    return ctx.reply(`${newAdmin.message}`);
  } catch (error) {
    console.error("Ошибка при выдаче прав администратора:", error);
    return ctx.reply("❌ Произошла ошибка при обработке запроса.");
  }
});

async function sendNewApplication(description, price, file, connect) {
  try {
    let htmlMessage = `🔥 <b>Новый заказ!</b> 🔥

📄 <b>Описание:</b> ${description}  
💰 <b>Бюджет:</b> ${price}  
📎 <b>ТЗ:</b> <a href="${file}">Открыть файл</a>  
📬 <b>Связь:</b> <a href="${connect}">Контакт для связи</a>
`;
    const result = await AllAdmins();
    if (!result.success) {
      return { success: false, message: "Не удалось получить список админов." };
    }

    const ids = result.ids;

    for (const chatID of ids) {
      await bot.telegram.sendMessage(chatID, htmlMessage, {
        parse_mode: "HTML",
      });
    }

    return { success: true,message:"Успех!" };
  } catch (error) {
    console.error("Ошибка при рассылке:", error);
    return { success: false, message: "❌ Произошла ошибка при рассылке." };
  }
}

module.exports = {bot, sendNewApplication};
