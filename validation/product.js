const Joi = require('@hapi/joi');

exports.ADD_PRODUCT_MODEL = Joi.object({
    name: Joi.string().min(5).max(250).required(),
    description: Joi.string().min(5).max(250).required(),
    price: Joi.number().required(),
    quantity: Joi.number().required()
})