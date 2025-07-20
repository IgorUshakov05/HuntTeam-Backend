const { Router } = require("express");
const { validationResult } = require("express-validator");
const { validDataRequest } = require("../validator/Request");
const { sendNewApplication } = require("../../bot/bot");

const router = Router();
const { CreateApplication } = require("../../database/Request/Application");
router.post("/request", validDataRequest, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  let save_in_database = await CreateApplication(req.body);
  if (!save_in_database.success) {
    res.status(400).json({ success: false, message: save_in_database.message });
  }
  let spam = await sendNewApplication(
    save_in_database.new_application.description,
    save_in_database.new_application.price,
    save_in_database.new_application.file,
    save_in_database.new_application.connect
  );
  return await res.status(200).json({ success: true, message: spam.message });
});

module.exports = router;
