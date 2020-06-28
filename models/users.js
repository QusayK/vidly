const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 1024,
        required: true
    },
    isAdmin: Boolean
})

userSchema.methods.generateToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, process.env.SECRET_KEY) 
}

module.exports = mongoose.model('User', userSchema)