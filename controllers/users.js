const user = require('../models/user');
const { ERROR_CODE, ERROR_NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  user.find({})
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch(() => { res.status(SERVER_ERROR).send('Server error'); });
};

module.exports.getUserById = (req, res) => {
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
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send('Server error');
      }
    });
};

module.exports.createUser = (req, res) => {
  user.create({ ...req.body })
    .then((data) => {
      const {
        name, about, avatar, id,
      } = data;
      return res.status(201).send({
        name, about, avatar, _id: id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  return user.findByIdAndUpdate(userId, { name, about }, { runValidators: true, new: true })
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return user.findByIdAndUpdate(userId, { avatar }, { runValidators: true, new: true })
    .then((currentUser) => {
      if (!currentUser) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
