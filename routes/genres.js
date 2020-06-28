const express = require('express')
const { Genre } = require('../models/genres')
const { validateGenre } = require('../middlewares/validation')
const validateObjectId = require('../middlewares/validateObjectId')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

const router = express.Router();

router.get('/', auth, async (req, res) => {
        const genre = await Genre.find().sort('name');
        //res.render('index', { title: 'Home', name: 'What\'s up'});
        res.send(genre);
})

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = new Genre({ name: req.body.name })
    await genre.save()
    res.send(genre)
})

router.put('/:id', validateObjectId, async (req, res) => {
    try {
        const { error } = validateGenre(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {new: true})

        if (!genre) return res.status(404).send('Genre not found')

        res.send(genre)
    } catch (ex) {
        res.status(404).send(ex)
    }
})

router.delete('/:id', validateObjectId, [auth, admin], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id)
        res.status(200).send(genre)
    } catch (ex) {
        res.status(400).send(ex)
    }
})

router.get('/:id', validateObjectId, async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id)

        if (!genre) return res.status(404).send('Genre not found')
        res.send(genre)
    } catch (ex) {
        res.send(ex)
    }
})

module.exports = router;