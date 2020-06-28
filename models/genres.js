const mongoose = require('mongoose')
require('dotenv').config()

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Action', 'Horror', 'Romance'],
        required: true,
        minlength: 3,
        maxlength: 50
    }
})

exports.Genre = mongoose.model('Genres', genresSchema)
exports.genresSchema = genresSchema

