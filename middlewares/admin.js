const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send('Access forbidden.')
    
    next()
}