const mongoose = require("mongoose");
const UsersSchema = new mongoose.Schema({
  chatID: {
    type: String,
    require: true,
    uniqe: true,
  },
  name: {
    type: String,
  },
});

const model = mongoose.model("Users", UsersSchema);
module.exports = model;
