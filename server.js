const express = require('express'); // Corrected to use express properly
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000; // Define the port directly


// !!CHATGPT: Chat gpt was used to make the following code!!
// Middleware to parse JSON
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
});
// !!CHATGPT: Chat gpt was used to make the above code!!

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// This is what the transactional object's will look like
const transaction = new mongoose.Schema({
    transactionId: String,
    amount: Number,
    date: Date,
    type: String,
    userId: String
});

// This is what the user object's will look like
const user = new mongoose.Schema({
    username: String,
    password: String,
    balance: Number,
    transactions: Array,
    owned: Array,
    date: Date
});

// This is what the pet object's will look like
const pet = new mongoose.Schema({
    name: String,
    clothes: Array,
    userId: String
});

// Here I am assigning the transaction schema to a collection to use in the database
const transactions = mongoose.model('transactions', transaction);

// Here I am assigning the user schema to a collection to use in the database
const users = mongoose.model('users', user);

// Here I am assigning the pet schema to a collection to use in the database
const pets = mongoose.model('pets', pet);
