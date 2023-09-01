const router = require('express').Router();
const {
  getUsers,
  getUserById,
  editUser,
  editAvatar,
  getLoggedUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getLoggedUser);
router.get('/:userId', getUserById);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;
