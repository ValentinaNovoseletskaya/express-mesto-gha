const card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  card.create({
    name, link, owner,
  })
    .then(() => res.status(200).send({
      data: {
        name, link,
      },
    }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        throw console.log('Карточка не найдена');
      }
      res.status(200).send({ data });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw console.log('Карточка не найдена');
      }
      res.status(200).send({ data });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw console.log('Карточка не найдена');
      }
      res.status(200).send({ data });
    })
    .catch(next);
};
