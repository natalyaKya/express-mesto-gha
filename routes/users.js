const routerUser = require('express').Router();
const {
  returnUsers,
  returnUserById,
  updateProfile,
  updateAvatar,
  returnCurrentUser,
} = require('../controllers/users');
const {
  validationReturnCurrentUser,
  validationReturnUserBiId,
  validationUpdateProfile,
  validationUpdateAvatar,
} = require('../middlewares/validation');

routerUser.get('/', returnUsers);
routerUser.get('/me', validationReturnCurrentUser, returnCurrentUser);
routerUser.get('/:userId', validationReturnUserBiId, returnUserById);
routerUser.patch('/me', validationUpdateProfile, updateProfile);
routerUser.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = routerUser;
