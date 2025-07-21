const { Router } = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const { validDataRequest } = require("../validator/Request");
const { sendNewApplication } = require("../../bot/bot");
const { CreateApplication } = require("../../database/Request/Application");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "storage")); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = uuidv4() + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/request",
  upload.single("file"), 
  validDataRequest,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    if (req.file) {
      req.body.file = req.file.filename; 
    }
    console.log(req.body.file)
    let save_in_database = await CreateApplication(req.body);

    if (!save_in_database.success) {
      return res
        .status(400)
        .json({ success: false, message: save_in_database.message });
    }

    let spam = await sendNewApplication(
      save_in_database.new_application.description,
      save_in_database.new_application.price,
      save_in_database.new_application.file, 
      save_in_database.new_application.connect
    );

    return res.status(200).json({ success: true, message: spam.message });
  }
);

module.exports = router;
