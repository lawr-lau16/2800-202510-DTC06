const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// ------------------ Session Setup ------------------ //
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Mock user session (simulated login)
app.use((req, res, next) => {
  req.session.user = { _id: "testuser123" };
  next();
});

// ------------------ Middleware ------------------ //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ------------------ View Engine Setup ------------------ //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------ MongoDB Connection ------------------ //
mongoose
  .connect("mongodb://localhost:27017/expenseApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ------------------ Mongoose Models ------------------ //
const Transaction = require("./models/Transaction");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  balance: Number,
  transactions: Array,
  owned: Array,
  date: Date,
});

const petSchema = new mongoose.Schema({
  name: String,
  clothes: Array,
  userId: String,
});

const users = mongoose.model("users", userSchema);
const pets = mongoose.model("pets", petSchema);

// ------------------ Routes ------------------ //

// Serve expense logging HTML form
app.get("/add-expense", (req, res) => {
  res.sendFile(path.join(__dirname, "expense_log.html"));
});

// Handle form submission and save to MongoDB
app.post("/add-expense", async (req, res) => {
  const { type, name, amount, category, date } = req.body;

  try {
    const newTransaction = new Transaction({
      type,
      name,
      amount,
      category,
      date: new Date(date),
      userId: req.session.user._id,
    });

    await newTransaction.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error("❌ Error saving transaction:", err);
    res.status(500).send("Error saving transaction");
  }
});

// Dashboard to display entries and totals
app.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send("Unauthorized");
    }

    const expenses = await Transaction.find({ userId: req.session.user._id });

    const totalBudget = 2000; // Static placeholder
    const totalSpent = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalSpent;

    res.render("dashboard", {
      expenses,
      totalBudget,
      totalSpent,
      totalIncome,
      balance,
    });
  } catch (error) {
    console.error("❌ Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

// Delete a transaction
app.post("/delete-expense/:id", async (req, res) => {
  try {
    await Transaction.deleteOne({
      _id: req.params.id,
      userId: req.session.user._id,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
    res.status(500).send("Error deleting transaction");
  }
});

// Redirect base URL to dashboard
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// ------------------ Start Server ------------------ //
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
