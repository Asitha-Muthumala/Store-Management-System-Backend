const Joi = require('@hapi/joi');

 exports.USER_MODEL = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(12).required()
})

exports.USER_LOGIN_MODEL = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})