const { celebrate, Joi } = require('celebrate');
const regularLink = require('../utils/regular');

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(regularLink).required(),
  }),
});

const validationDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationReturnCurrentUser = celebrate({
  body: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

const validationReturnUserBiId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validationUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regularLink),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(regularLink),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
});

module.exports = {
  validationCreateCard,
  validationDeleteCard,
  validationLikeCard,
  validationReturnCurrentUser,
  validationReturnUserBiId,
  validationUpdateProfile,
  validationUpdateAvatar,
  validationLogin,
  validationCreateUser,
};
