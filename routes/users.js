const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  editUser,
  editAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.post('/login', login);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;
