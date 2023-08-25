const routerCard = require('express').Router();
const {
  returnCards,
  createCard,
  deleteCardBiId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validationCreateCard, validationDeleteCard, validationLikeCard } = require('../middlewares/validation');

routerCard.get('/', returnCards);
routerCard.post('/', validationCreateCard, createCard);
routerCard.delete('/:cardId', validationDeleteCard, deleteCardBiId);
routerCard.put('/:cardId/likes', validationLikeCard, likeCard);
routerCard.delete('/:cardId/likes', validationLikeCard, dislikeCard);

module.exports = routerCard;
