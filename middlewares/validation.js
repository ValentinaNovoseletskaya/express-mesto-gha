const { celebrate, Joi } = require('celebrate');
const urlValidation = require('../utils/regulars');

const signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const signUpValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlValidation),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

module.exports = {
  signInValidation,
  signUpValidation,
};
