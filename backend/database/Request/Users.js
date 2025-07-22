const UsersSchema = require("../Schema/Users");

async function MakeAdmin(chatID, name) {
  try {
    const existingUser = await UsersSchema.findOne({ chatID });

    if (existingUser) {
      return { success: true, message: "✅ Вы уже администратор." };
    }

    const newAdmin = new UsersSchema({ chatID, name });
    await newAdmin.save();

    return { success: true, message: "🎉 Теперь вы администратор!" };
  } catch (error) {
    console.error("Ошибка при назначении администратора:", error);
    return {
      success: false,
      message: "❌ Не удалось выдать права администратора.",
    };
  }
}

async function AllAdmins() {
  try {
    const allAdmins = await UsersSchema.find({}, { chatID: 1, _id: 0 });
    const ids = allAdmins.map((user) => user.chatID);
    return { success: true, ids };
  } catch (error) {
    console.error("Ошибка при получении списка администраторов:", error);
    return {
      success: false,
      message: "❌ Не удалось получить список администраторов.",
    };
  }
}
module.exports = { MakeAdmin, AllAdmins };
