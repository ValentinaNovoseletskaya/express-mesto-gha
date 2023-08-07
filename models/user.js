const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "имя" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "имя" - 2'],
      maxlength: [30, 'Максимальная длина поля "имя" - 30'],
    },
    about: {
      type: String,
      required: [true, 'Поле "о себе" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "о себе" - 2'],
      maxlength: [30, 'Максимальная длина поля "о себе" - 30'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "ссылка на аватар" должно быть заполнено'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
