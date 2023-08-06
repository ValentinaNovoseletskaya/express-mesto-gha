const user = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  const SERVER_ERROR = 500;
  return user.find({})
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch(res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  const ERROR_NOT_FOUND = 404;
  const SERVER_ERROR = 500;
  return user.findById(userId)
    .then((data) => {
      if (!data) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        const {
          name, about, avatar, id,
        } = data;
        res.status(200).send(
          {
            name, about, avatar, _id: id,
          },
        );
      }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const ERROR_CODE = 400;
  const SERVER_ERROR = 500;
  return user.create({ ...req.body })
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
        res.status(ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    })
    .catch(next);
};

module.exports.editUser = (req, res, next) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND = 404;
  const SERVER_ERROR = 500;
  const userId = req.user._id;
  const { name, about } = req.body;
  return user.findByIdAndUpdate(userId, { name, about }, { runValidators: true, new: true })
    .then((data) => {
      if (!data) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(200).send({ data });
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
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const ERROR_CODE = 400;
  const ERROR_NOT_FOUND = 404;
  const SERVER_ERROR = 500;
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
    })
    .catch(next);
};
