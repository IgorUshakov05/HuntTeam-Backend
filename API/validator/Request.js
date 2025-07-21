const { body } = require("express-validator");
// POST api/v1/request
const validDataRequest = [
  body("connect").custom((value) => {
    if (typeof value !== "string") {
      throw new Error("Поле 'connect' обязательно и должно быть строкой");
    }

    const allowedPrefixes = [
      "https://t.me/",
      "https://vk.com/",
      "https://tenchat.ru/",
      "t.me/",
      "vk.com/",
      "tenchat.ru/",
    ];

    const startsWithAllowed = allowedPrefixes.some((prefix) =>
      value.startsWith(prefix)
    );

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!startsWithAllowed && !isEmail) {
      throw new Error(
        "Должно быть email или начинаться с https://t.me, https://vk.com или https://tenchat.ru"
      );
    }

    return true;
  }),
  body("description").isString().notEmpty(),
  body("price")
    .isNumeric()
    .withMessage("Поле 'price' должно быть числом")
    .isFloat({ min: 10000, max: 10000000 })
    .withMessage("Цена должна быть от 10 000 до 10 000 000"),
];

module.exports = { validDataRequest };
