const user = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((data) => {
      if (!data) {
        throw console.log('Пользователь не найден');
      }
      res.status(200).send({ data });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  user.create({
    name, about, avatar,
  })
    .then(() => res.status(200).send({
      data: {
        name, about, avatar,
      },
    }))
    .catch(next);
};

module.exports.editUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  user.findByIdAndUpdate(userId, { name, about })
    .then((data) => {
      if (!data) {
        throw console.log('Пользователь не найден');
      }
      res.status(200).send({ data });
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  user.findByIdAndUpdate(userId, { avatar })
    .then((data) => {
      if (!data) {
        throw console.log('Пользователь не найден');
      }
      res.status(200).send({ data });
    })
    .catch(next);
};
