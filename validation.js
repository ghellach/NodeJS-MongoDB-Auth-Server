//modules
const Joi = require('@hapi/joi');

const loginValidator = (data) => {
    const verify = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return verify.validate(data);
}

const registerValidator = (data) => {

    const verify = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return verify.validate(data);
};


module.exports.loginValidator = loginValidator;
module.exports.registerValidator = registerValidator;