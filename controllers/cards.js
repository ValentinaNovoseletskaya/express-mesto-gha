const card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  const ERROR_CODE = 400;
  return card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err) {
        res.status(ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else {
        res.status(500).send('Server error');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const ERROR_CODE = 400;
  const { name, link } = req.body;
  const owner = req.user;
  return card.create({
    name, link, owner,
  })
    .then(() => res.status(200).send({
      data: {
        name, link,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(500).send('Server error');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data });
      }
    })
    .catch(() => res.status(500).send('Server error'))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const ERROR_CODE = 400;
  const { cardId } = req.params;
  const userId = req.user._id;
  return card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
      } else {
        res.status(500).send('Server error');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  return card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data });
      }
    })
    .catch(() => res.status(500).send('Server error'))
    .catch(next);
};
