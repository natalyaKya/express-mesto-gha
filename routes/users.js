const routerUser = require('express').Router();
const {
  returnUsers,
  returnUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

routerUser.get('/', returnUsers);
routerUser.get('/:userId', returnUserById);
routerUser.post('/', createUser);
routerUser.patch('/me', updateProfile);
routerUser.patch('/me/avatar', updateAvatar);

module.exports = routerUser;
