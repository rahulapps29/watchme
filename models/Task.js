const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "optional"],
    trim: true,
    maxlength: [200, "desc can not be more than 200 characters"],
  },
  meal: {
    type: String,
    required: [true, "optional"],
    trim: true,
    maxlength: [200, "transtype can not be more than 200 characters"],
  },
  comment: {
    type: String,
    required: [true, "optional"],
    trim: true,
    maxlength: [200, "transtype can not be more than 200 characters"],
  },
  sugar: { type: String },
  insulin: { type: String },
  lantus: { type: String },
  tDate: {
    type: Date,
    // required: [true, "must provide date"],
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
