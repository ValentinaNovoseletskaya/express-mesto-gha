const card = require('../models/card');
const { ERROR_CODE, ERROR_NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;
  card.create({
    name, link, owner,
  })
    .then((data) => res.status(201).send({ data }))
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

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return card.findByIdAndRemove(cardId)
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
