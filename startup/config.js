require('dotenv').config()
const winston = require('winston')

module.exports = function () {
    if (!process.env.SECRET_KEY)
        throw new Error('FATAL ERROR: token SECRET_KEY is not defined.')
}