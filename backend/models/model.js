// Import mongoose library
const mongoose = require('mongoose');

// Create schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profile: mongoose.Schema.ObjectId

}, {versionKey: false});

// Export schema
module.exports = mongoose.model('users', userSchema);
