const express = require("express");
const app = express();
const request_router = require("./API/routes/request");
const file_router = require("./API/routes/files");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api/v1", request_router, file_router);
app.get("/", (req, res) => {
  res.status(200).json({ host: process.env.HOST });
});
module.exports = app;
