const card = require('../models/card');
const CastError = require('../middlewares/errors/CastError');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const ValidationError = require('../middlewares/errors/ValidationError');
const OwnerError = require('../middlewares/errors/OwnerError');

module.exports.getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((e) => {
      next(e);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  card.create({
    name, link, owner,
  })
    .then((data) => res.status(201).send({ data }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new ValidationError('Ошибка в параметрах ввода');
        next(err);
      } else if (e.name === 'CastError') {
        const err = new CastError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  card.findById(cardId)
    .orFail(new Error('NotValidId'))
    .then((data) => {
      if (!data.owner.equals(userId)) {
        const err = new OwnerError('Нельзя удалить чужую карточку');
        next(err);
        return;
      }
      card.deleteOne({ _id: cardId }).then(() => res.status(200).send({ data }));
    })
    .catch((e) => {
      if (e.message === 'NotValidId') {
        const err = new NotFoundError('Карточка не найдена');
        next(err);
      } else if (e.name === 'CastError') {
        const err = new CastError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};

module.exports.likeCard = (req, res, next) => {
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
    .catch((e) => {
      if (e.message === 'NotValidId') {
        const err = new NotFoundError('Карточка не найдена');
        next(err);
      } else if (e.name === 'CastError') {
        const err = new CastError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
    .catch((e) => {
      if (e.message === 'NotValidId') {
        const err = new NotFoundError('Карточка не найдена');
        next(err);
      } else if (e.name === 'CastError') {
        const err = new CastError('Ошибка в параметрах ввода');
        next(err);
      }
      next(e);
    });
};
