const mongoose = require('mongoose')
const winston = require('winston')
require('dotenv').config()

module.exports = () => {
    // DB connection
    mongoose.connect(process.env.DB_CONNECT, { 
        useNewUrlParser: true, 
        useFindAndModify: true, 
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => winston.info('Connected to Mongodb..'))
}