const express = require('express')
const morgan = require('morgan')
const app = express()
const winston = require('winston')
require('dotenv').config()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/prod')(app)

// Set template engine
app.set('view engine', 'pug')

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => winston.info(`Server running on port ${PORT}...`))