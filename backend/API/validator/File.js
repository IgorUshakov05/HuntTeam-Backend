const { query } = require("express-validator");
// GET api/v1/file
const validDataFile = [
  query("title").notEmpty().withMessage("Не передано название файла"),
];

module.exports = { validDataFile };
