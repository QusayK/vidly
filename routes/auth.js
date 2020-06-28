const express = require('express')
const User = require('../models/users')
const { auth_validation } = require('../middlewares/validation')
const bcrypt = require('bcrypt')

const router = express.Router()

router.post('/', async (req, res) => {
    const { error } = auth_validation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try{
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send('Invalid email or password.')

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send('Invalid email or password.')

        const token = user.generateToken()
        res.send(token)
    } catch (err) {
        res.status(500).send(err.errors.name.properties.message)
    }
})

module.exports = router