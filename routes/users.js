const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidation = require('../utils/regulars');
const {
  getUsers,
  getUserById,
  editUser,
  editAvatar,
  getLoggedUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getLoggedUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),

  getUserById,
);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlValidation),
  }),
}), editAvatar);

module.exports = router;
