const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

function validateGenre(genre) {

    const schema = {
        name: Joi.string().min(3).max(50).required()
    }

    return Joi.validate(genre, schema)
}

function validateCustomer(customer) {

    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean,
        phone: Joi.string.min(5).max(50).required()
    }

    return Joi.validate(customer, schema)
}

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    }

    return Joi.validate(movie, schema)
}

function validateRental(rental) {

    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(rental, schema)
}

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }

    return Joi.validate(user, schema)
}

function auth_validation(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }

    return Joi.validate(user, schema)
}

exports.validateGenre = validateGenre
exports.validateCustomer = validateCustomer
exports.validateMovie = validateMovie
exports.validateRental = validateRental
exports.validateUser = validateUser
exports.auth_validation = auth_validation