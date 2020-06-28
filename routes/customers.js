const express = require('express')
const Customer = require('../models/customers')
const { validateCustomer } = require('../middlewares/validation')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customer = await Customer.find().sort('name');
        //res.render('index', { title: 'Home', name: 'What\'s up'})
        res.send(customer);
    } catch (ex) {
        res.status(500).send(ex)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({ 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone 
    })

    try {
        await customer.save()
        res.send(customer)
    } catch (err) {
        res.status(500).send(err.errors.name.properties.message)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { error } = validateCustomer(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        
        const customer = await Customer.findByIdAndUpdate(req.params.id, { 
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone 
        }, {new: true})

        if (!customer) return res.status(404).send('Customer not found')

        res.send(customer)
    } catch (ex) {
        res.status(404).send(ex)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id)
        res.status(200).send(customer)
    } catch (ex) {
        res.status(400).send(ex)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)

        if (!customer) return res.status(404).send('Customer not found')
        res.send(customer)
    } catch (ex) {
        res.send(ex)
    }
})

module.exports = router;