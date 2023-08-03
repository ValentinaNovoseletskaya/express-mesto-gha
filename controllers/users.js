const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw console.log('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({
    name, about, avatar,
  })
    .then(() => res.status(200).send({
      data: {
        name, about, avatar,
      },
    }))
    .catch(next);
};
