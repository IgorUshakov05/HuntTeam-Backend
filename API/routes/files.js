const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const { validDataFile } = require("../validator/File");
const { validationResult } = require("express-validator");

const router = Router();

router.get("/file", validDataFile, async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const title = req.query.title;
    const filePath = path.resolve(__dirname, "..", "..", "storage", title);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "Файл не найден" });
    }

    const storagePath = path.resolve(__dirname, "..", "..", "storage");
    if (!filePath.startsWith(storagePath)) {
      return res
        .status(403)
        .json({ success: false, message: "Доступ запрещен" });
    }

    return res.sendFile(filePath);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Ошибка при отправке файла" });
  }
});

module.exports = router;
