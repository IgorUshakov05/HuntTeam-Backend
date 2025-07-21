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
function formatContactLink(connect) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(connect)) {
    return `mailto:${connect}`;
  }
  return connect;
}
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendNewApplication(description, price, file, connect) {
  try {
    let htmlMessage = `🔥 <b>Новый заказ!</b> 🔥
📄 <b>Описание:</b> 
<pre><code>${escapeHtml(description)}</code></pre>   
💰 <b>Бюджет:</b> ${price}p
📎 <b>ТЗ:</b> <a href="${process.env.HOST}/api/v1/file?title=${file}">${process.env.HOST}/api/v1/file?title=${file}</a>  
📬 <b>Связь:</b> <a href="${formatContactLink(connect)}">${connect}</a>
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

    return { success: true, message: "Успех!" };
  } catch (error) {
    console.error("Ошибка при рассылке:", error);
    return { success: false, message: "❌ Произошла ошибка при рассылке." };
  }
}

module.exports = { bot, sendNewApplication };
