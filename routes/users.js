const express = require('express')
const User = require('../models/users')
const { validateUser } = require('../middlewares/validation')
const auth = require('../middlewares/auth')
const bcrypt = require('bcrypt')
const _ = require('lodash')

const router = express.Router()

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password')
        res.send(user)
    } catch (err) {
        res.status(400).send(err.errors.name.properties.message)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try{
        let user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send('User already registered.')

        user = new User(_.pick(req.body, ['name', 'email', 'password']))
        const salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(req.body.password, salt)
        await user.save()

        const token = user.generateToken()
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
    } catch (err) {
        res.status(500).send(err.errors.name.properties.message)
    }
})

router.put('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try{
        const user = await User.findByIdAndUpdate(req.params.id, { 
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        if (!user) return res.status(404).send('User not found')
        
        res.send(user._id)
    } catch (err) {
        res.status(500).send(err.errors.name.properties.message)
    }
})

router.delete('/', async (req, res) => {
    try{
        const user = await User.findByIdAndRemove(req.params.id)
        res.status(200).send(user._id)
    } catch (err) {
        res.status(400).send(err.errors.name.properties.message)
    }
})

router.get('/', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        res.status(200).send(user._id)
    } catch (err) {
        res.send(400).send(err.errors.name.properties.message)
    }
})

module.exports = router