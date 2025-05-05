const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["expense", "income"], required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
