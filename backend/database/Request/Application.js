const ApplicationSchema = require("../Schema/Application");
async function CreateApplication({
  connect,
  description,
  file = null,
  price = null,
}) {
  try {
    let new_application = new ApplicationSchema({
      connect,
      description,
      file,
      price,
    });
    await new_application.save();
    return { success: true, new_application, message: "Заявка отправлена!" };
  } catch (e) {
    return { success: false, message: "Ошибка при создании заявки" };
  }
}

module.exports = { CreateApplication };
