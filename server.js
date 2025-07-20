const express = require("express");
const app = express();
const request_router = require("./API/routes/routes");
app.use(express.json());
app.use("/api/v1", request_router);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Start" });
});
module.exports = app;
