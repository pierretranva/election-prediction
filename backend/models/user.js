// Initialize user schema and model

import {Schema, mongoose} from "mongoose";
import {userDb} from "../connection.js";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profile: mongoose.Schema.ObjectId,
    email: String,
}, {versionKey: false})

const user = userDb.model('users', userSchema);

export default user;