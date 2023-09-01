const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const {
  notFoundError, castError, validationError, duplicateEmailError, authError,
} = require('../utils/errors');

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  return user.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((data) => {
      const {
        name, about, avatar, id,
      } = data;
      res.status(200).send(
        {
          name, about, avatar, _id: id,
        },
      );
    })
    .catch((e) => {
      if (e.message === 'NotValidId') {
        const err = notFoundError('Пользователь не найден');
        next(err);
      } else if (e.name === 'CastError') {
        const err = castError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};

module.exports.getLoggedUser = (req, res, next) => {
  const userId = req.user._id;
  return user.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((data) => {
      const {
        name, about, avatar, id,
      } = data;
      res.status(200).send(
        {
          name, about, avatar, _id: id,
        },
      );
    })
    .catch((e) => {
      if (e.message === 'NotValidId') {
        const err = notFoundError('Пользователь не найден');
        next(err);
      } else if (e.name === 'CastError') {
        const err = castError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};

module.exports.createUser = (req, res, next) => {
  const reqPassword = req.body.password;
  if (!reqPassword) {
    const err = validationError('Необходим пароль');
    next(err);
  }
  bcrypt.hash(reqPassword, 10)
    .then((hash) => user.create({ ...req.body, password: hash })
      .then((data) => {
        const {
          name, about, avatar, id, email, password,
        } = data;
        return res.status(201).send({
          name, about, avatar, _id: id, email, password,
        });
      })
      .catch((e) => {
        if (e.code === 11000) {
          const err = duplicateEmailError('Пользователь с такой почтой уже зарегистрирован');
          next(err);
        } else if (e.name === 'ValidationError') {
          const err = validationError('Ошибка в параметрах ввода');
          next(err);
        } else if (e.name === 'CastError') {
          const err = castError('Ошибка в параметрах ввода');
          next(err);
        }
        next(e);
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((User) => {
      const payload = {
        _id: User._id,
      };
      const token = jwt.sign(payload, 'some-secret-key');
      return res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }).status(200).json({ token });
    })
    .catch(() => {
      const err = authError('Необходима авторизация');
      next(err);
    });
};

module.exports.editUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return user.findByIdAndUpdate(userId, { name, about }, { runValidators: true, new: true })
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((e) => {
      if (e.message === 'NotValidId') {
        const err = notFoundError('Пользователь не найден');
        next(err);
      } else if (e.name === 'ValidationError') {
        const err = validationError('Ошибка в параметрах ввода');
        next(err);
      } else if (e.name === 'CastError') {
        const err = castError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};

module.exports.editAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return user.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .then((currentUser) => {
      if (!currentUser) {
        const err = notFoundError('Пользователь не найден');
        next(err);
      } else {
        res.status(200).send({
          data: {
            name: currentUser.name,
            about: currentUser.about,
            avatar: currentUser.avatar,
            _id: currentUser.id,
          },
        });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = validationError('Ошибка в параметрах ввода');
        next(err);
      } else if (e.name === 'CastError') {
        const err = castError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};
