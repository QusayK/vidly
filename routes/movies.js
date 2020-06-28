const express = require('express')
const Movies = require('../models/movies')
const { Genre } = require('../models/genres')
const { validateMovie } = require('../middlewares/validation')

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const movies = await Movies.find().sort('title');
        res.send(movies);
    } catch (ex) {
        res.status(500).send(ex)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Invalid genre.')

    const movies = new Movies({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate 
    })

    try {
        await movies.save()
        res.send(movies)
    } catch (err) {
        res.status(500).send(err.errors.name.properties.message)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { error } = validateMovie(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        const genre = await Genre.findById(req.body.genreId)
        if (!genre) return res.status(400).send('Invalid genre.')
        
        const movies = await Movies.findByIdAndUpdate(req.params.id, { 
            title: req.body.title,
            genre: {
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate 
        }, {new: true})

        if (!movies) return res.status(404).send('Movies not found')

        res.send(movies)
    } catch (ex) {
        res.status(404).send(ex)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const movies = await Movies.findByIdAndRemove(req.params.id)
        res.status(200).send(movies)
    } catch (ex) {
        res.status(400).send(ex)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const movies = await Movies.findById(req.params.id)

        if (!movies) return res.status(404).send('Movies not found')
        res.send(movies)
    } catch (ex) {
        res.send(ex)
    }
})

module.exports = router;