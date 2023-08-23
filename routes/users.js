const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  returnUsers,
  returnUserById,
  updateProfile,
  updateAvatar,
  returnCurrentUser,
} = require('../controllers/users');

routerUser.get('/', returnUsers);
routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), returnUserById);
routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), updateAvatar);
routerUser.get('/me', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), returnCurrentUser);

module.exports = routerUser;
