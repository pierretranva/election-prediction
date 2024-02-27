// Schema for users
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profile: mongoose.Schema.ObjectId

}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);