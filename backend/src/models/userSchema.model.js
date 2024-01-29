const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:String,
    lastName:String,
    password:String
});

export const User = mongoose.model('User',userSchema);
