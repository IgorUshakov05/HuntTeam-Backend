const mongoose = require("mongoose");
const { v4 } = require("uuid");
const ApplicationSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    default: v4(),
  },
  connect: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  file: {
    type: String,
    require: false,
  },
  price: {
    type: Number,
    require: false,
  },
});

const model = mongoose.model("ApplicationSchema", ApplicationSchema);
module.exports = model;
