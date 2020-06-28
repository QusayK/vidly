const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')
require('dotenv').config()

module.exports = function () {
    // Uncaught exceptions handling
    winston.exceptions.handle(new winston.transports.File({ filename: 'logfile.log' }))

    // Uncaught promise rejection handling
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex)
        process.exit(1)
    })*

    // Logfile
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // DB log 
    winston.add(new winston.transports.MongoDB({
        db: process.env.DB_CONNECT,
        level: 'info'
    }))

}