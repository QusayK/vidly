const express = require('express')

module.exports = function (app) {
    // Middlewares
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    // Routes
    app.use('/api/genres', require('../routes/genres'))
    app.use('/api/customers', require('../routes/customers'))
    app.use('/api/movies', require('../routes/movies'))
    app.use('/api/rentals', require('../routes/rentals'))
    app.use('/api/users', require('../routes/users'))
    app.use('/api/auth', require('../routes/auth'))
    // Error middleware
    app.use(require('../middlewares/error'))
}