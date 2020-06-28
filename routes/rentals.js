const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Rental = require('../models/rentals')
const Movie = require('../models/movies')
const Customer = require('../models/customers')
const fawn = require('fawn')
const Fawn = require('fawn/lib/fawn')
const movies = require('../models/movies')
const { validateRental } = require('../middlewares/validation')

Fawn.init(mongoose)

router.get('/', async (req, res) => {
    try {
        const rental = await Rental.find().sort('name');
        res.send(rental);
    } catch (ex) {
        res.status(500).send(ex)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send('Invalid customer.')

    const movie = Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send('Invalid movie.')

    if (!movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')

    let rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    try {
        await new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movies._id }, { $inc: { numberInStock: -1 } })
        .run()

        res.send(rental)
    } catch (err) {
        res.status(500).send(err.errors.name.properties.message)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { error } = validateRental(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        
        const movie = Movie.findById(req.body.movieId)
        if (!movie) return res.status(400).send('Movie not found.')

        const customer = Customer.findById(req.body.customerId)
        if (!customer) return res.status(400).send('Customer not found.')

        const rental = await Rental.findByIdAndUpdate(req.params.id, { 
            customer: {
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        }, {new: true})

        if (!rental) return res.status(404).send('rental not found')

        res.send(rental)
    } catch (ex) {
        res.status(404).send(ex)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const rental = await Rental.findByIdAndRemove(req.params.id)
        res.status(200).send(rental)
    } catch (ex) {
        res.status(400).send(ex)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)

        if (!rental) return res.status(404).send('rental not found')
        res.send(rental)
    } catch (ex) {
        res.send(ex)
    }
})

module.exports = router;